import { Dispatch, SetStateAction } from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";
import { useUpdateProductMutation } from "../api/updateProduct";
import ProductForm, { ProductFormType } from "./ProductForm";
import { useAuth } from "../../../context/AuthContext";

type Props = {
    setIsShowEditProduct: Dispatch<SetStateAction<boolean>>;
    id: string;
    priceId: string;
    name: string;
    description: string;
    price: number;
    categoryId: number;
    image: string | Blob;
    stockQuantity: number;
    createdAt: Date;
};

const EditProductPopup = (props: Props) => {
    console.log('EditProductPopup props:', props);
    const { token } = useAuth();
    const { mutate: updateProduct } = useUpdateProductMutation(props.id, token);

    const handleCloseEditProduct = () => {
        console.log('Closing EditProductPopup');
        props.setIsShowEditProduct(false);
    };

    const onFormSubmit = (data: ProductFormType, preview: string) => {
        const product = {
            ...data,
            image: data.image as Blob,
            imagePath: preview as string,
            id: props.id,
        };
        updateProduct(product);
        props.setIsShowEditProduct(false);
    };

    return createPortal(
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[99999] flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    console.log('Overlay clicked, closing popup');
                    handleCloseEditProduct();
                }
            }}
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Edit Product
                    </h1>
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={handleCloseEditProduct}
                    >
                        <MdClose className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <ProductForm
                        onFormSubmit={onFormSubmit}
                        product={{
                            id: props.id,
                            priceId: props.priceId,
                            name: props.name,
                            description: props.description,
                            price: props.price,
                            categoryId: props.categoryId,
                            stockQuantity: props.stockQuantity,
                            image: props.image,
                            createdAt: props.createdAt,
                        }}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
};


export default EditProductPopup;
