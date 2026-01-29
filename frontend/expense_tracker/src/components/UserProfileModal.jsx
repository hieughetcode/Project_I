import React, { useState, useContext, useEffect } from "react";
import Modal from "./Modal"; // Tận dụng Modal có sẵn của bạn
import ProfilePhotoSelector from "./Inputs/ProfilePhotoSelector"; // Component chọn ảnh
import { UserContext } from "../context/userContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { toast } from "react-hot-toast";

const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useContext(UserContext);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reset ảnh khi mở/đóng modal
  useEffect(() => {
    if (isOpen) {
      setImage(null);
    }
  }, [isOpen]);

  // --- LOGIC XỬ LÝ CHÍNH Ở ĐÂY ---
  const handleSaveProfile = async () => {
    if (!image) {
      toast.error("Vui lòng chọn ảnh mới để cập nhật");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = user.profileImageUrl;

      // 1. Upload ảnh lên server (Lấy URL)
      const formData = new FormData();
      formData.append("image", image); // Key 'image' phải khớp với backend

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

      // 2. Cập nhật thông tin User trong Database với URL ảnh mới
      // Lưu ý: Cần đảm bảo bạn đã thêm API_PATHS.AUTH.UPDATE_USER vào file apiPaths.js như hướng dẫn trước
      const updateRes = await axiosInstance.put(API_PATHS.AUTH.UPDATE_USER, {
        profileImageUrl: imageUrl,
      });

      // 3. Cập nhật lại Context (để giao diện thay đổi ngay lập tức)
      if (updateRes.data) {
        updateUser(updateRes.data);
        toast.success("Cập nhật ảnh đại diện thành công!");
        onClose(); // Đóng modal
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cập nhật ảnh đại diện"
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-center my-4">
            {/* Component chọn ảnh có sẵn của bạn */}
            <ProfilePhotoSelector image={image} setImage={setImage} />
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium"
            >
                Hủy
            </button>
            <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="px-6 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserProfileModal;