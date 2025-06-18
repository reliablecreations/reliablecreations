import "react-quill/dist/quill.snow.css";

const ProductDescription = ({ product }: any) => {
  return (
    <div className="product-description">
      <div dangerouslySetInnerHTML={{ __html: product.description as any }} />
    </div>
  );
};

export default ProductDescription;
