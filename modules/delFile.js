import fs from 'fs';

const delFile = (name) => {
  fs.unlinkSync("./uploads/" + name);
}

export default delFile