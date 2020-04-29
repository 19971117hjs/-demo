<template>
  <div class="home">
    <el-container>
      <el-header>
        <el-form ref="form"
                 :model="form"
                 label-width="80px">
          <el-row>
            <h1>搜索及统计区</h1>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="月份">
                <el-date-picker v-model="form.date"
                                type="month"
                                value-format="yyyy-MM"
                                placeholder="选择月份"
                                @change="commonChange()"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="分类">
                <el-select v-model="form.categories"
                           placeholder="请选择"
                           multiple
                           collapse-tags
                           @change="commonChange()">
                  <el-option v-for="item in categoriesOptions"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="排序">
                <el-select v-model="form.sortType"
                           placeholder="请选择"
                           @change="commonChange()"
                           clearable>
                  <el-option v-for="item in sortOptions"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="收入">
                <el-input v-model="form.income"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="支出">
                <el-input v-model="form.pay"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="总计">
                <el-input v-model="form.count"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="mian-class">
        <el-row>
          <h1>
            列表区
            <el-button icon="el-icon-edit"
                       type="warning"
                       circle
                       class="btn-style"
                       @click="add()"></el-button>
          </h1>
        </el-row>
        <el-row>
          <el-collapse v-model="activeName"
                       :data="table.data"
                       class="collapse-tyle">
            <el-collapse-item v-for="(item, idx) in table.data"
                              :key="idx"
                              :title="item.time.slice(0,7)+'/'+item.name+'/ '+item.amount"
                              :name="idx+'@'"
                              :class="itemColor(item.type)">
              <div>时间：{{item.time}}</div>
              <div>分类id：{{item.category}}</div>
              <div>金额：{{item.amount}}</div>
              <div>类型：{{item.type}}</div>
            </el-collapse-item>
          </el-collapse>
        </el-row>
      </el-main>

      <el-dialog title="新建账单"
                 :visible.sync="DialogVisible"
                 width="30%"
                 center>
        <addDialog ref="addBillRef"
                   :billDetail="billDetail"
                   :categoryDatail="categoryDatail"
                   :key="(new Date()).toString()"></addDialog>
        <div class="bt-foot">
          <el-button @click="doCancel()">取 消</el-button>
          <el-button type="primary"
                     @click="doEnter()">确 定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import billCsv from "../views/csv/bill.csv";
import categoriesCsv from "../views/csv/categories.csv";
import { formatDate, formatType, currencyFormat } from "../utils/format.js";
import { clone, getParamType, compose } from "../utils/index.js";
import addDialog from "./addDialog";

export default {
  name: "Home",
  components: {
    addDialog
  },
  data() {
    return {
      tableData1: [], //新增账单插入中介
      tableData2: [], //新增账单分类中介
      activeName: [],
      cloneTable: [], //缓存初始数据
      categoriesOptions: [], //就是tableData2,别名区分
      sortOptions: [
        { id: "升序", name: "升序" },
        { id: "降序", name: "降序" }
      ], //排序选择器options
      billDetail: {
        //新增账单字段
        type: "",
        category: "",
        amount: "",
        time: null
      },
      categoryDatail: {
        //为空时账单分类为'默认'字段
        id: "",
        type: "",
        name: ""
      },
      DialogVisible: false, //新增弹窗显示隐藏
      form: {
        //查询，统计表单字段
        date: "",
        categories: [],
        sortType: "",
        income: 0,
        pay: 0,
        count: 0
      },
      table: {
        // 列表信息字段
        data: []
      }
    };
  },
  watch: {},

  computed: {},

  created() {
    this.init();
  },

  mounted() { },

  methods: {
    init() {
      // csv转对象数组
      this.tableData1 = this.toJson(billCsv);
      this.tableData2 = this.toJson(categoriesCsv);

      //新增账单尾部增加
      if (this.billDetail.time != null) {
        this.tableData1.push(this.billDetail);
        // 新增账单分类
        if (
          this.billDetail.category === "0000000000" &&
          !this.tableData2.find(v => v.id === "0000000000")
        ) {
          this.tableData2.push(this.categoryDatail);
        }
      }

      // 缓存单表数据
      let t1 = clone(this.tableData1);
      let t2 = clone(this.tableData2);
      // 合并表格，格式化展示数据
      this.table.data = this.concatTable(t1, t2);
      this.formatHome(this.table.data, "type", "time", "amount");
      // 缓存初始数据
      this.cloneTable = clone(this.table.data);
      // 数据统计
      this.calculate(this.table.data);

      //账单分类选择器数据缓存
      this.categoriesOptions = this.tableData2;
      sessionStorage.setItem(
        "categoriesOptions",
        JSON.stringify(this.tableData2)
      );
    },

    //csv文件转key：value格式,
    toJson(csv) {
      const arr = [];
      const keys = csv[0];
      const values = csv.slice(1);
      const len1 = values.length,
        len2 = keys.length;
      for (let i = 0; i < len1; i++) {
        for (let j = 0; j < len2; j++) {
          if (!arr[i]) {
            arr[i] = {};
          }
          arr[i][keys[j]] = values[i][j];
        }
      }
      return arr;
    },

    //表合并
    concatTable(t1, t2) {
      let a = t1.map(v1 => {
        t2.forEach(v2 => {
          v1.category === v2.id ? Object.assign(v1, v2) : v1;
        });
        return v1;
      });
      return a;
    },

    //数据格式化处理
    formatHome(data, k1, k2, k3) {
      data.forEach(v => {
        v[k1] = formatType(Number(v[k1]));
        v[k2] = formatDate(Number(v[k2]));
        v[k3] = currencyFormat(v[k3]);
      });
    },

    //对金额还原成num
    reAmount(s) {
      return parseFloat(s.replace(/￥/, ""));
    },

    // 选择器事件
    commonChange() {
      this.$nextTick(
        () => (this.table.data = this.allFliterCalculate(this.table.data))
      );
    },

    dateFliter(tableData) {
      if (this.form.date) {
        tableData = tableData.filter(
          v => v.time.slice(0, 7) === this.form.date
        );
      }
      return tableData;
    },

    categoriesFliter(tableData) {
      if (this.form.categories.length > 0) {
        tableData = tableData.filter(v =>
          this.form.categories.includes(v.category)
        );
      }
      return tableData;
    },

    sortFliter(tableData) {
      if (this.form.sortType === "升序") {
        tableData.sort(
          (a, b) => this.reAmount(a.amount) - this.reAmount(b.amount)
        );
      } else if (this.form.sortType === "降序") {
        tableData.sort(
          (a, b) => this.reAmount(b.amount) - this.reAmount(a.amount)
        );
      }
      return tableData;
    },

    allFliterCalculate(tableData) {
      tableData = this.cloneTable; //每次筛选数据前，将table.data还原全数据
      return compose(
        this.sortFliter,
        this.calculate,
        this.categoriesFliter,
        this.dateFliter
      )(tableData);
    },

    //计算
    calculate(tableData) {
      this.form.income = 0;
      this.form.pay = 0; //清除上次缓存
      if (tableData.length > 0) {
        tableData.forEach(v => {
          if (v.type === "收入") {
            this.form.income += this.reAmount(v.amount);
          } else {
            this.form.pay += this.reAmount(v.amount);
          }
        });
      }
      this.form.count = this.form.income - this.form.pay;
      return tableData;
    },

    itemColor(type) {
      if (type === "收入") {
        return "income-color";
      } else {
        return "pay-color";
      }
    },

    add() {
      this.DialogVisible = true;
    },

    doEnter() {
      return this.$refs.addBillRef.save().then(res => {
        if (res) {
          this.init();
          this.DialogVisible = false;
        }
      });
    },

    doCancel() {
      this.DialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  .mian-class {
    margin-top: 90px;
  }
  .btn-style {
    position: relative;
    left: 35px;
  }
  .collapse-tyle {
    width: 40%;
    margin: 0 auto;
  }
  .income-color {
    /deep/.el-collapse-item__header {
      background-color: rgb(115, 222, 179);
    }
  }
  .pay-color {
    /deep/.el-collapse-item__header {
      background-color: rgb(235, 127, 101);
    }
  }
  .bt-foot {
    display: flex; //flex布局
    justify-content: center; //x轴排列
    align-items: center; //y轴排列
  }
}
</style>

