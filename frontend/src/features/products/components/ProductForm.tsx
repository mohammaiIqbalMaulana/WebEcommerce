import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import PreviewImage from "../../../components/Elements/PreviewImage";
import { useState } from "react";
import { IProduct } from "../../../types/product";

type Props = {
  product?: IProduct;
  categoryName?: string;
  onFormSubmit: (data: ProductFormType, preview: string) => void;
};

const fieldRequiredError = "This field is required.";
const productValidationSchema = yup.object().shape({
    name: yup.string().required(fieldRequiredError),
    description: yup.string().required(fieldRequiredError),
    price: yup.number().required(fieldRequiredError).positive(),
    stockQuantity: yup.number().required(fieldRequiredError).positive().integer(),
    category: yup.string().required(fieldRequiredError),
    image: yup.mixed().required(fieldRequiredError),
});
export type ProductFormType = yup.InferType<typeof productValidationSchema>;

const ProductForm = (props: Props) => {
    console.log('ProductForm props:', props);
    const { register, handleSubmit, formState: { errors, isDirty }, control, setValue } = useForm<ProductFormType>({
        resolver: yupResolver(productValidationSchema),
        defaultValues: {
            category: props.categoryName,
            ...props.product
        }
    });
    const [preview, setPreview] = useState<string | ArrayBuffer | null | undefined>(props.product?.image as string);

    const onSubmit = (data: ProductFormType) => props.onFormSubmit(data, preview as string);

    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-0">
            {/* Image Preview */}
            <div className="flex-shrink-0 w-full lg:w-auto">
                <PreviewImage
                    control={control}
                    setValue={setValue}
                    error={errors.image?.message}
                    preview={preview}
                    setPreview={setPreview}
                />
            </div>

            {/* Form */}
            <form
                className="flex-1 space-y-4 min-w-0"
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* Product Name */}
                <div className="space-y-2">
                    <label htmlFor="productName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("name")}
                        type="text"
                        id="productName"
                        placeholder="Enter product name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm flex items-center">
                            <span className="mr-1">⚠</span> {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label htmlFor="productDescription" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register("description")}
                        id="productDescription"
                        rows={4}
                        placeholder="Describe your product in detail"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm flex items-center">
                            <span className="mr-1">⚠</span> {errors.description.message}
                        </p>
                    )}
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="productPrice" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Price ($) <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("price")}
                            type="number"
                            step={0.01}
                            min={0}
                            id="productPrice"
                            placeholder="0.00"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                        {errors.price && (
                            <p className="text-red-500 text-sm flex items-center">
                                <span className="mr-1">⚠</span> {errors.price.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="productStockQuantity" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Stock Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("stockQuantity")}
                            type="number"
                            min={0}
                            id="productStockQuantity"
                            placeholder="0"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                        {errors.stockQuantity && (
                            <p className="text-red-500 text-sm flex items-center">
                                <span className="mr-1">⚠</span> {errors.stockQuantity.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <label htmlFor="productCategory" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("category")}
                        type="text"
                        id="productCategory"
                        placeholder="Enter product category"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    {errors.category && (
                        <p className="text-red-500 text-sm flex items-center">
                            <span className="mr-1">⚠</span> {errors.category.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!isDirty}
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                    {props.product ? "Update Product" : "Add Product"}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;