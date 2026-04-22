//src/components/common/TitleBlock.jsx

export default function TitleBlock({ title }) {
    return (
        <h2 className="text-title text-center border-b bg-linear-to-t from-primary to-white to-40% py-[15px] px-[10px] min-h-header-height"> 
            {title}
        </h2>
    );
}