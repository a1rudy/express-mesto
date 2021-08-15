const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    validate: {
      validator(url) {
        return /^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([A-Za-z]{1,10})([\w\W\d]{1,})?$/.test(
          url
        );
      },
      message: "Не верный формат ссылки",
    },
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  },
  email: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: "Не верный формат email",
    },
  },
  password: {
    type: String,
    required: true,
    unique: true,
    select: false,
    validate: {
      validator(v) {
        return validator.isStrongPassword(v);
      },
      message: "Вы используете не надежный пароль",
    },
  },
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Неправильный email или пароль."));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Неправильный email или пароль."));
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
