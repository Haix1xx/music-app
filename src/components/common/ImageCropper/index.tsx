import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useState } from "react";

const ImageCropper = ({
    avatarUrl,
    cancelEdit,
    setCropper
}: { avatarUrl: string, cancelEdit: () => void, setCropper: any }) => {

return (
    <>
        <Cropper
            src={avatarUrl}
            style={{ height: 300, width: 300 }}
            aspectRatio={1}
            minCropBoxHeight={100}
            minCropBoxWidth={100}
            guides={false}
            checkOrientation={false}
            onInitialized={(instance) => {
                setCropper(instance);
            }}
        />
    </>
);
}

export default ImageCropper