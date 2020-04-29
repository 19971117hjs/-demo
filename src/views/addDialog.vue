<template>
  <div class="addDialog">
    <el-form ref="formRef" label-width="100px" :model="form" :rules="rules">
      <el-row>
        <el-col :span="24">
          <el-form-item label="账单类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="账单分类">
            <el-select v-model="form.category" placeholder="请选择">
              <el-option
                v-for="item in categoriesOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="21">
          <el-form-item label="账单金额" prop="amount">
            <el-input v-model.trim="form.amount" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { formatDate, formatType, currencyFormat } from "../utils/format.js";
import { clone, getParamType, compose } from "../utils/index.js";

export default {
  name: "addDialog",
  props: {
    billDetail: {
      type: Object
    },
    categoryDatail: {
      type: Object
    }
  },
  data() {
    const amountValidate = (r, value, cb) => {
      let isTwoDecimal = /^\d*(\.)?(\d{0,2})?$/.test(value);
      if (!value) {
        cb(new Error("请输入账单金额"));
      } else if ("" + Number(value) === "NaN") {
        cb(new Error("请输入数字值"));
      } else if (Number(value) && !isTwoDecimal) {
        cb(new Error("最多输入2位小数"));
      } else {
        cb();
      }
    };
    return {
      typeOptions: [
        { id: "0", name: "支出" },
        { id: "1", name: "收入" }
      ],
      categoriesOptions: [],
      form: {
        type: "",
        category: "",
        amount: "",
        time: new Date().getTime()
      },
      rules: {
        type: {
          required: true,
          message: "请选择账单类型",
          trigger: ["blur", "change"]
        },
        amount: {
          required: true,
          validator: amountValidate,
          trigger: ["blur", "change"]
        }
      }
    };
  },
  watch: {},

  computed: {},

  created() {
    this.init();
  },

  mounted() {},

  methods: {
    init() {
      this.categoriesOptions = JSON.parse(
        sessionStorage.getItem("categoriesOptions")
      );
    },

    /* 数据校验 */
    validate() {
      return new Promise(resolve => {
        this.$refs.formRef.validate(res => {
          if (res) {
            resolve(this.form);
          } else {
            resolve(false);
          }
        });
      });
    },

    save() {
      return new Promise((resolve, reject) => {
        this.validate().then(res => {
          if (res) {
            if (!this.form.category) {
              this.form.category = "0000000000";
              let a = {
                id: "0000000000",
                type: this.form.type,
                name: "默认"
              };
              Object.assign(this.categoryDatail, a);
            }
            Object.assign(this.billDetail, this.form);
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
// .addDialog {
// }
</style>


