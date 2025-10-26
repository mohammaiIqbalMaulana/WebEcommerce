import { Dispatch, SetStateAction } from "react";
import { MdClose } from "react-icons/md";
import { useCreateProductMutation } from "../api/createProduct";
import Popup from "../../../components/Elements/Popup";
import ProductForm, { ProductFormType } from "./ProductForm";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";

type Props = {
  setIsShowCreateProduct: Dispatch<SetStateAction<boolean>>;
};

const CreateProductPopup = (props: Props) => {
    const { token } = useAuth();
    const { mutate: createProduct } = useCreateProductMutation(token);

    const handleCloseCreateProduct = () => props.setIsShowCreateProduct(false);

    const onFormSubmit = (data: ProductFormType, preview: string) => {
        const product = {
            ...data,
            image: data.image as Blob,
            imagePath: preview as string,
        };
        createProduct(product);
        props.setIsShowCreateProduct(false);
    };

    return (
        <Popup setIsShowPopup={props.setIsShowCreateProduct}>
            <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <div className="flex justify-between items-center mb-6">
                    <motion.h1
                        className="text-2xl font-bold text-gray-900 dark:text-white"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Create New Product
                    </motion.h1>
                    <motion.button
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={handleCloseCreateProduct}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <MdClose className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </motion.button>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <ProductForm
                        onFormSubmit={onFormSubmit}
                    />
                </motion.div>
            </motion.div>
        </Popup>
    );
};

export default CreateProductPopup;