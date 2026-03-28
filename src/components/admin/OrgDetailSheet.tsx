import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, Phone, MapPin, FileText, Globe, Facebook, Instagram, Twitter, Linkedin, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { useState } from "react";

export interface Organization {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstOrRegId: string;
  address: string;
  city: string;
  pincode: string;
  description: string;
  logoUrl: string;
  status: "pending" | "approved" | "rejected" | "info_requested";
  socialLinks: {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  submittedAt: string;
}

interface OrgDetailSheetProps {
  org: Organization | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (orgId: string, action: "approved" | "rejected" | "info_requested", comment: string) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending Review", className: "bg-accent/20 text-accent-foreground border-accent/30" },
  approved: { label: "Approved", className: "bg-secondary/20 text-secondary border-secondary/30" },
  rejected: { label: "Rejected", className: "bg-destructive/20 text-destructive border-destructive/30" },
  info_requested: { label: "Info Requested", className: "bg-primary/20 text-primary border-primary/30" },
};

const OrgDetailSheet = ({ org, open, onOpenChange, onAction }: OrgDetailSheetProps) => {
  const [comment, setComment] = useState("");
  const [activeAction, setActiveAction] = useState<string | null>(null);

  if (!org) return null;

  const handleAction = (action: "approved" | "rejected" | "info_requested") => {
    onAction(org.id, action, comment);
    setComment("");
    setActiveAction(null);
    onOpenChange(false);
  };

  const status = statusConfig[org.status];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 rounded-xl border-2 border-border">
              <AvatarImage src={org.logoUrl} alt={org.name} />
              <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-lg">
                {org.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-xl font-bold">{org.name}</SheetTitle>
              <SheetDescription className="mt-1">Submitted {org.submittedAt}</SheetDescription>
              <Badge variant="outline" className={`mt-2 ${status.className}`}>{status.label}</Badge>
            </div>
          </div>
        </SheetHeader>

        <Separator />

        {/* Contact Info */}
        <div className="py-4 space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Contact Details</h3>
          <div className="space-y-2.5">
            <InfoRow icon={<Building2 className="w-4 h-4" />} label="Contact Person" value={org.contactPerson} />
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={org.email} />
            <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={org.phone} />
            <InfoRow icon={<FileText className="w-4 h-4" />} label="GST / Reg ID" value={org.gstOrRegId} />
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Address" value={`${org.address}, ${org.city} - ${org.pincode}`} />
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div className="py-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Description</h3>
          <p className="text-sm text-foreground leading-relaxed">{org.description}</p>
        </div>

        <Separator />

        {/* Social Links */}
        <div className="py-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Social Media</h3>
          <div className="flex flex-wrap gap-2">
            {org.socialLinks.website && <SocialBadge icon={<Globe className="w-3.5 h-3.5" />} label="Website" url={org.socialLinks.website} />}
            {org.socialLinks.facebook && <SocialBadge icon={<Facebook className="w-3.5 h-3.5" />} label="Facebook" url={org.socialLinks.facebook} />}
            {org.socialLinks.instagram && <SocialBadge icon={<Instagram className="w-3.5 h-3.5" />} label="Instagram" url={org.socialLinks.instagram} />}
            {org.socialLinks.twitter && <SocialBadge icon={<Twitter className="w-3.5 h-3.5" />} label="Twitter" url={org.socialLinks.twitter} />}
            {org.socialLinks.linkedin && <SocialBadge icon={<Linkedin className="w-3.5 h-3.5" />} label="LinkedIn" url={org.socialLinks.linkedin} />}
          </div>
        </div>

        <Separator />

        {/* Action Section */}
        <div className="py-4 space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Take Action</h3>

          <Textarea
            placeholder="Add a comment or reason (required for reject / request info)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px]"
          />

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              onClick={() => handleAction("approved")}
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Approve
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary/10"
              onClick={() => handleAction("info_requested")}
              disabled={!comment.trim()}
            >
              <MessageSquare className="w-4 h-4 mr-2" /> Request Info
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => handleAction("rejected")}
              disabled={!comment.trim()}
            >
              <XCircle className="w-4 h-4 mr-2" /> Reject
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <span className="text-muted-foreground mt-0.5">{icon}</span>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  </div>
);

const SocialBadge = ({ icon, label, url }: { icon: React.ReactNode; label: string; url: string }) => (
  <a href={url} target="_blank" rel="noopener noreferrer">
    <Badge variant="outline" className="gap-1.5 cursor-pointer hover:bg-muted transition-colors">
      {icon} {label}
    </Badge>
  </a>
);

export default OrgDetailSheet;
