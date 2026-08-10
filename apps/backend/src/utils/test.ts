const myarray = [[1, 2], 8, 7, [3, 4]];
// console.log(myarray.flat())

function flatArray(arr: any[]) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] == "object") {
      const res: any = flatArray(arr[i]);
      result.push(...res);
    } else result.push(arr[i]);
  }
  return result;
}

const test = flatArray(myarray);
console.log(test);
