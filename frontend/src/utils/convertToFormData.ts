import { IProduct } from "../types/product";

export const convertToFormData = (data: Partial<IProduct> | any) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
        formData.append(key, value as string);
    }
    return formData;
};