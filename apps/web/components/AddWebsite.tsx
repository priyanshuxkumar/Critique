import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"

interface WebsiteProps {
    name : string;
    websiteUrl: string;
    description: string;
    iconUrl: string
}

interface AddWebsitePageProp {
    dialogOpen: boolean;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    addWebsiteData: WebsiteProps;
    setAddWebsiteData : React.Dispatch<React.SetStateAction<WebsiteProps>>;
    handleSelectImg: () => void;
    isMediaUploading: boolean;
    handleAddWebsite: () => void;
}

/**
 * @param {AddWebsitePageProp} props - Component props
 * @param {boolean} props.dialogOpen - Controls modal visibility
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setDialogOpen - Toggles modal state
 * @param {WebsiteProps} props.addWebsiteData - Website details
 * @param {React.Dispatch<React.SetStateAction<WebsiteProps>>} props.setAddWebsiteData - Updates website data
 * @param {() => void} props.handleSelectImg - Handles website icon/image selection
 * @param {boolean} props.isMediaUploading - Tracks website icon/image upload status
 * @param {() => void} props.handleAddWebsite - Sends a request to add the website
 * @returns {JSX.Element} The AddWebsite component
 */

const AddWebsite: React.FC<AddWebsitePageProp> = ({
    dialogOpen, 
    setDialogOpen, 
    addWebsiteData, 
    setAddWebsiteData, 
    handleSelectImg, 
    isMediaUploading, 
    handleAddWebsite
  }) => {
    return (
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add your Website
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Add your Wesbite
              </DialogTitle>
              <DialogDescription>List your website with us</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input onChange={(e) => setAddWebsiteData((prev) => ({...prev, name: e.target.value}))}
                  id="name"
                  placeholder="Enter website name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website-link">Website Link</Label>
                <Input onChange={(e) => setAddWebsiteData((prev) => ({...prev, websiteUrl: e.target.value}))}
                  id="website-link"
                  placeholder="Enter website Link"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  onChange={(e) => setAddWebsiteData((prev) => ({...prev, description: e.target.value}))}
                  id="description"
                  rows={5}
                  placeholder="Enter Description"
                />
              </div>
              <Button variant={"outline"} onClick={ handleSelectImg } className="text-lg h-12 ">
                {isMediaUploading ? (<span>Uploading...</span>) : (<span>Upload website icon</span>) }
              </Button>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddWebsite}
                type="submit"
                disabled={
                  !addWebsiteData.name ||
                  !addWebsiteData.websiteUrl ||
                  !addWebsiteData.description
                }
              >
                Sent request!
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
}

export default AddWebsite;