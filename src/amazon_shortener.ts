window.onload = () => {
  const asinElement = <HTMLInputElement>(
    document.querySelector(
      '#ASIN, input[name="idx.asin"], input[name="ASIN.0"]'
    )
  );
  if (asinElement) {
    const path = "/dp/" + asinElement.value;
    window.history.pushState({}, "", path);
  }
};
