import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type Props = {
    title: string;
    img: string;
}

export const CaterogyBox = (props: Props) => {
    return (
        <motion.div
            className="relative flex flex-col w-full aspect-[3/4] min-h-[180px] max-h-[300px] drop-shadow-custom bg-customGradient rounded-2xl overflow-hidden group cursor-pointer"
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <Link to={`/products/shop?category=${props.title.toLowerCase()}`}>
                <motion.img
                    className="absolute top-0 left-0 w-full h-full rounded-2xl object-cover transition-transform duration-300 group-hover:scale-110"
                    src={props.img}
                    alt={`${props.title} category`}
                    whileHover={{ scale: 1.1 }}
                />
                <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-2xl"
                    initial={{ opacity: 0.6 }}
                    whileHover={{ opacity: 0.8 }}
                />
                <motion.h4
                    className="z-20 font-extrabold text-sm sm:text-base md:text-lg lg:text-xl text-center text-white mt-auto py-3 sm:py-4 md:py-6 px-2 sm:px-3 md:px-4"
                    initial={{ y: 20, opacity: 0.9 }}
                    whileHover={{ y: 0, opacity: 1, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    {props.title}
                </motion.h4>
                <motion.div
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-white rounded-full group-hover:w-16 transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: 64 }}
                />
            </Link>
        </motion.div>
    );
};
