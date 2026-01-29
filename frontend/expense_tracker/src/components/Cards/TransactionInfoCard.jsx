import React, { useState, useEffect } from 'react'
import { LuUtensils, LuTrendingUp, LuTrendingDown, LuTrash2, } from "react-icons/lu"

const TransactionInfoCard = ({ title, icon, date, amount, type, hideDeleteBtn, onDelete }) => {

    // State xử lý khi ảnh bị lỗi (chỉ dùng nếu icon là URL)
    const [imgError, setImgError] = useState(false);

    // Reset lỗi khi icon thay đổi
    useEffect(() => {
        setImgError(false);
    }, [icon]);

    const getAmountStyles = () =>
        type === 'income' ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500";

    // Hàm kiểm tra xem chuỗi có giống URL ảnh không (chứa '/', 'http', 'data:')
    // Nếu không phải URL, ta coi nó là Emoji
    const isImageUrl = (url) => {
        if (!url) return false;
        return url.includes('/') || url.includes('http') || url.includes('data:');
    };

    return (
        <div className="group relative flex item-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60">
            <div className='w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full overflow-hidden'>
                {icon ? (
                    // Logic mới: Kiểm tra URL hay Emoji
                    isImageUrl(icon) ? (
                        // Nếu là URL ảnh
                        !imgError ? (
                            <img
                                src={icon}
                                alt={title}
                                className='w-full h-full object-cover'
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <LuUtensils /> // Fallback icon khi ảnh lỗi
                        )
                    ) : (
                        // Nếu là Emoji (từ form chọn icon) -> Hiển thị text
                        <span className="text-2xl">{icon}</span>
                    )
                ) : (
                    // Không có icon -> Hiển thị mặc định
                    <LuUtensils />
                )}
            </div>

            <div className='flex-1 flex items-center justify-between'>
                <div>
                    <p className="text-sm text-gray-700 font-medium">{title}</p>
                    <p className="text-xs text-gray-400 mt-1">{date}</p>
                </div>

                <div className="flex items-center gap-2">
                    {!hideDeleteBtn && (
                        <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={onDelete}>
                            <LuTrash2 size={18} />
                        </button>
                    )}

                    <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}
                    >
                        <h6 className="text-xs font-medium">
                            {type === "income" ? "+" : "-"} ${amount}
                        </h6>
                        {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionInfoCard