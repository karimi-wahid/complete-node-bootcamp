module.exports = (temp, product) => {
  const replace = (field, value) => {
    const pattern = new RegExp(
      "\\{%" + field + "%\\}|\\{&" + field + "&\\}",
      "g",
    );
    return (temp) => temp.replace(pattern, value);
  };

  let output = temp;
  output = replace("PRODUCTNAME", product.productName)(output);
  output = replace("IMAGE", product.image)(output);
  output = replace("PRICE", product.price)(output);
  output = replace("FROM", product.from)(output);
  output = replace("NUTRIENTSCTNAME", product.nutrients)(output);
  output = replace("QUANTITY", product.quantity)(output);
  output = replace("DESCRIPTION", product.description)(output);
  output = replace("ID", product.id)(output);

  if (!product.organic) {
    output = replace("NOT_ORGANIC", "not-organic")(output);
  }

  return output;
};
