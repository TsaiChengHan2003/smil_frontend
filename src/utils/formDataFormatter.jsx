export const FormatToFormData = data => {
  // console.log(data);
  const formData = new FormData();

  formData.append("id", data.id);

  const { id, ...rest } = data;

  Object.keys(rest).forEach(key => {
    const value = rest[key];

    if (Array.isArray(value) && value.every(item => item instanceof File)) {
      console.log(value, "跑這3 (File 陣列)");

      value.forEach(file => {
        formData.append(key, file);
      });
    } else if (Array.isArray(value) && value.every(item => item instanceof Object)) {
      formData.append(key, JSON.stringify(value));
    } else {
      // console.log(value, "跑這4 (一般數據)");
      formData.append(key, value);
    }
  });

  // Object.keys(data).forEach(key => {
  //   const value = data[key];

  //   if (Array.isArray(value) && value.every(item => item instanceof File)) {
  //     console.log(value, "跑這3 (File 陣列)");

  //     value.forEach(file => {
  //       formData.append(key, file);
  //     });
  //   } else if (Array.isArray(value) && value.every(item => item instanceof Object)) {
  //     formData.append(key, JSON.stringify(value));
  //   } else {
  //     // console.log(value, "跑這4 (一般數據)");
  //     formData.append(key, value);
  //   }
  // });

  // formData.forEach((value, key) => {
  //   console.log(key, value);
  // });
  return formData;
};