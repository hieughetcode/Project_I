import React from 'react'

const DeleteAlert = ({content, ondelete}) => {
  return (
    <div>
        <p className="text-sm">{content}</p>

        <div className="flex justify-end mt-6">
            <button
                type="button"
                className="add-btn add-btn-fill"
                onClick={ondelete}
            >
                Delete
            </button>
        </div>
    </div>
  );
};

export default DeleteAlert