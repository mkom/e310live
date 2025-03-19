import Image from "next/image";

const BadgeImage = ({ id, alt = "Team Badge", size = 50 }) => {
  const badgeId = id ? id : "";  
  const defaultPlaceholder = "/icon/logo/badge-placeholder.png"; // Gambar default
  const imageUrl = id ? `/api/images/team/${id}.webp` : defaultPlaceholder;

 // console.log("imageUrl", imageUrl);

  return (
    <div className="relative w-fit min-w-8">
      <Image
        src={imageUrl}
        alt={alt}
        width={size}
        height={size}
        className="rounded-md object-contain w-8 h-8 "
        priority
      />
    </div>
  );
};

export default BadgeImage;
