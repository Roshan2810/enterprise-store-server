async function dummy(i) {
  // console.log('this is the start');
  const startTime = Date.now();
  setTimeout(function cb() {
    const endTime = Date.now();
    console.log(
      "Callback 1: this is a msg from call back",
      i,
      endTime - startTime
    );
  }, 40000); // has a default time value of 0

  console.log("this is just a message");

  // setTimeout(function cb1() {
  //   console.log('Callback 2: this is a msg from call back');
  // }, 0);

  // console.log('this is the end');
}
for (let j = 0; j < 10; j++) {
  for (let i = 0; i < 60000; i++) {
    Promise.allSettled(dummy(i));
  }
}
