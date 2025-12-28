import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useCreateListing, useUpdateListing, ListingInsert, Listing, ListingType } from "@/hooks/useListings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ListingFormProps {
  listing?: Listing;
  onSuccess?: () => void;
}

const PRACTICE_OPTIONS = [
  "No-till farming",
  "Cover crops",
  "Rotational grazing",
  "Holistic management",
  "Silvopasture",
  "Composting",
  "Permaculture",
  "Biodynamic",
  "Organic certified",
  "Agroforestry",
];

const ListingForm = ({ listing, onSuccess }: ListingFormProps) => {
  const createListing = useCreateListing();
  const updateListing = useUpdateListing();
  const isEditing = !!listing;

  const [formData, setFormData] = useState<ListingInsert>({
    name: listing?.name || "",
    type: listing?.type || "farm",
    description: listing?.description || "",
    address: listing?.address || "",
    city: listing?.city || "",
    state: listing?.state || "",
    zip_code: listing?.zip_code || "",
    latitude: listing?.latitude || 37.7749,
    longitude: listing?.longitude || -122.4194,
    phone: listing?.phone || "",
    email: listing?.email || "",
    website: listing?.website || "",
    practices: listing?.practices || [],
    products: listing?.products || [],
    image_url: listing?.image_url || "",
  });

  const [productInput, setProductInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(listing?.image_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file type", description: "Please select an image file", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Image must be less than 5MB", variant: "destructive" });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image_url || null;

    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("listing-images")
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Upload failed", description: "Could not upload image", variant: "destructive" });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    handleChange("image_url", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (field: keyof ListingInsert, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePractice = (practice: string) => {
    const current = formData.practices || [];
    if (current.includes(practice)) {
      handleChange("practices", current.filter((p) => p !== practice));
    } else {
      handleChange("practices", [...current, practice]);
    }
  };

  const addProduct = () => {
    if (productInput.trim() && !formData.products?.includes(productInput.trim())) {
      handleChange("products", [...(formData.products || []), productInput.trim()]);
      setProductInput("");
    }
  };

  const removeProduct = (product: string) => {
    handleChange("products", (formData.products || []).filter((p) => p !== product));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const imageUrl = await uploadImage();
    const dataToSubmit = { ...formData, image_url: imageUrl || undefined };

    if (isEditing && listing) {
      await updateListing.mutateAsync({ id: listing.id, ...dataToSubmit });
    } else {
      await createListing.mutateAsync(dataToSubmit);
    }
    onSuccess?.();
  };

  const isLoading = createListing.isPending || updateListing.isPending || isUploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Listing Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Green Meadows Farm"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ListingType) => handleChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farm">Farm</SelectItem>
                  <SelectItem value="market">Farmers Market</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe your farm, market, or restaurant..."
                rows={4}
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Farm Photo</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-40 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload image</span>
                  <span className="text-xs text-muted-foreground/70">Max 5MB</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="123 Farm Road"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="San Francisco"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="CA"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => handleChange("zip_code", e.target.value)}
                placeholder="94102"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleChange("latitude", parseFloat(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleChange("longitude", parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="contact@farm.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="https://www.farm.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practices & Products */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Regenerative Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {PRACTICE_OPTIONS.map((practice) => (
                <Badge
                  key={practice}
                  variant={formData.practices?.includes(practice) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => togglePractice(practice)}
                >
                  {practice}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Products & Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                placeholder="Add a product..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addProduct())}
              />
              <Button type="button" variant="outline" onClick={addProduct}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.products?.map((product) => (
                <Badge key={product} variant="secondary" className="gap-1">
                  {product}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeProduct(product)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : isEditing ? "Update Listing" : "Create Listing"}
      </Button>
    </form>
  );
};

export default ListingForm;
