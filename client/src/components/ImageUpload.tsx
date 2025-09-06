import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSpeciesIdentification } from "@/hooks/use-species-identification";
import { Camera, Upload, Microscope, MapPin, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onAnalysisComplete: (result: any) => void;
}

export default function ImageUpload({ onAnalysisComplete }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [regionCode, setRegionCode] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { identifySpecies, isLoading } = useSpeciesIdentification();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    toast({
      title: "Image uploaded",
      description: "Image selected successfully",
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    try {
      const result = await identifySpecies.mutateAsync({
        image: selectedFile,
        regionCode: regionCode || undefined,
      });
      
      onAnalysisComplete(result);
      toast({
        title: "Analysis complete",
        description: "Species identification successful",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to identify species. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glassmorphism border-border/50" data-testid="card-image-upload">
      <CardContent className="p-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center text-foreground">
          <Upload className="text-saffron mr-3" />
          Species Identification
        </h2>
        
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer
            ${dragActive ? 'border-saffron bg-saffron/5' : 'border-saffron/30 hover:border-saffron/60'}
            ${selectedFile ? 'border-forest bg-forest/5' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          data-testid="dropzone-upload"
        >
          <div className="mandala-pattern w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center">
            {selectedFile ? (
              <div className="w-16 h-16 bg-forest/20 rounded-full flex items-center justify-center">
                <Camera className="text-forest text-2xl" />
              </div>
            ) : (
              <Camera className="text-saffron text-3xl" />
            )}
          </div>
          
          {selectedFile ? (
            <>
              <h3 className="text-lg font-medium mb-2 text-forest">Image Selected</h3>
              <p className="text-muted-foreground mb-4">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">Click to change image</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-2">Upload Plant or Insect Image</h3>
              <p className="text-muted-foreground mb-4">Drag & drop or click to select an image</p>
              <p className="text-sm text-muted-foreground">Supports JPG, PNG, WebP • Max 10MB</p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          data-testid="input-file"
        />

        {/* Region Selection */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2 flex items-center">
            <MapPin className="text-forest mr-2 h-4 w-4" />
            Geographic Region (Optional)
          </label>
          <Select value={regionCode} onValueChange={setRegionCode} data-testid="select-region">
            <SelectTrigger className="bg-secondary border-border focus:border-saffron">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Regions</SelectItem>
              <SelectItem value="BC_CA">British Columbia, Canada</SelectItem>
              <SelectItem value="US_NE">US Northeast</SelectItem>
              <SelectItem value="US_SE">US Southeast</SelectItem>
              <SelectItem value="IN_N">North India</SelectItem>
              <SelectItem value="IN_S">South India</SelectItem>
              <SelectItem value="IN_E">East India</SelectItem>
              <SelectItem value="IN_W">West India</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={!selectedFile || isLoading}
          className="w-full mt-6 bg-gradient-to-r from-saffron to-gold text-background font-semibold hover:shadow-lg hover:shadow-saffron/25 transform hover:scale-105 transition-all"
          data-testid="button-analyze"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Microscope className="mr-2 h-4 w-4" />
              Analyze Species
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
