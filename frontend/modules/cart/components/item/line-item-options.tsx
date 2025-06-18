import { HttpTypes } from "@medusajs/types";
import { Text } from "@medusajs/ui";

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined;
  "data-testid"?: string;
  "data-value"?: HttpTypes.StoreProductVariant;
};

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {
  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      style={{
        display: "inline-block",
        color: "var(--text-muted, #6b7280)",
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        fontSize: "12px",
      }}
    >
      Variant: {variant?.title}
    </Text>
  );
};

export default LineItemOptions;
