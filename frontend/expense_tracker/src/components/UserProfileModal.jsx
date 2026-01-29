import React, { useState, useContext, useEffect } from "react";
import Modal from "./Modal";
import ProfilePhotoSelector from "./Inputs/ProfilePhotoSelector";
import { UserContext } from "../context/userContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { toast } from "react-hot-toast";

const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useContext(UserContext);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setImage(null);
    }
  }, [isOpen]);

  const handleSaveProfile = async () => {
    if (!image) {
      toast.error("Please select a new image to update.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = user.profileImageUrl;

      const formData = new FormData();
      formData.append("image", image);

      const uploadRes = await axiosInstance.post(
        API_PATHS.IMAGE.UPLOAD_IMAGE,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (uploadRes.data && uploadRes.data.imageUrl) {
        imageUrl = uploadRes.data.imageUrl;
      }

      const updateRes = await axiosInstance.put(API_PATHS.AUTH.UPDATE_USER, {
        profileImageUrl: imageUrl,
      });

      if (updateRes.data) {
        updateUser(updateRes.data);
        toast.success("Profile photo updated successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Profile Photo"
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-center my-4">
            <ProfilePhotoSelector image={image} setImage={setImage} />
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium"
            >
                Cancel
            </button>
            <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="px-6 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save Changes"}
            </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserProfileModal;