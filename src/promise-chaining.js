require("./db/mongoose");
const tsk = require("./models/task");

const aa = async(id)=>{

  const re = await tsk.findByIdAndDelete({_id : id})
  const res = await tsk.countDocuments();
  return res
}

aa("5d1b501d726274b3b42e6813").then((res)=>{

    console.log(res)
})