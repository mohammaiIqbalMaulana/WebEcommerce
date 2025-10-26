import { api } from "../../../app/api";
import { useMutation } from "@tanstack/react-query";
import { IProduct } from "../../../types/product";

const searchProduct = (searchQuery: string): Promise<IProduct[]> => {
    return api.post("/products/search", { searchQuery }).then((response) => response.data);
};

export const useSearchProductMutation = () => {
    return useMutation({
        mutationFn: (searchQuery: string) => searchProduct(searchQuery)
    });
};