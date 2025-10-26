import { useRef, useEffect, Dispatch, SetStateAction, ReactNode } from "react";

type Props = {
  setIsShowPopup: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};

const Popup = (props: Props) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                props.setIsShowPopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [props]);

    return (
        <div className="fixed inset-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50 z-[10000]">
            <div
                ref={popupRef}
                className="z-[10001]"
            >
                { props.children }
            </div>
        </div>
    );
};

export default Popup;