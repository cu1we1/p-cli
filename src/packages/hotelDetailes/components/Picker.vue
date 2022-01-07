<template>
  <Panel
    :visible="visible"
    content="590px"
    data-href=""
    @click="bgHide"
    data-exp="0"
    :data-log="
      $utils.inject({
        card_id: 'datePicker',
        card_name: '选择日期',
      })
    "
    :class="isDark ? 'datePicker_wrapBox_dark' : 'datePicker_wrapBox'"
  >
    <template #header>
      <div
        class="
          datePicker_headerBox_title
          fs_l
          cl_darkest
          fw_normal
          lc0
          ta_center
        "
      >
        选择日期
      </div>
    </template>
    <div class="datePicker_headerBox" :style="{ backgroundColor: '#fff' }">
      <!-- <div
        class="datePicker_headerBox_title fs_l cl_darkest fw_normal lc0 ta_center"
      >
        选择日期
      </div> -->
      <div class="datePicker_headerBox_grid L_grid-conxs">
        <div key="日" class="fc_ff6436 ta_center L_grid-cell7 L_grid-cellxs">
          日
        </div>
        <div
          class="fs_m cl_darkest ta_center L_grid-cell7 L_grid-cellxs"
          key="一"
        >
          一
        </div>
        <div
          class="fs_m cl_darkest ta_center L_grid-cell7 L_grid-cellxs"
          key="二"
        >
          二
        </div>
        <div
          class="fs_m cl_darkest ta_center L_grid-cell7 L_grid-cellxs"
          key="三"
        >
          三
        </div>
        <div
          class="fs_m cl_darkest ta_center L_grid-cell7 L_grid-cellxs"
          key="四"
        >
          四
        </div>
        <div
          class="fs_m cl_darkest ta_center L_grid-cell7 L_grid-cellxs"
          key="五"
        >
          五
        </div>
        <div
          key="六"
          class="fc_ff6436 fs_m ta_center L_grid-cell7 L_grid-cellxs"
        >
          六
        </div>
      </div>
      <div
        data-href=""
        :data-log="
          $utils.inject({
            control_name: '关闭',
            control_type: 'button',
            control_position: 1,
          })
        "
        class="datePicker_headerBox_close"
        @click="Hide"
      />
    </div>
    <!-- {{ renderDateList }} -->
    <!-- <Grid column={7} style={{ padding: "0 5px" }}> -->
    <color-scroll :style="{ height: boxHeight }" use-simulated-roll>
      <template v-for="(item, idx) in renderDateList">
        <div
          class="datePicker_division fs_l fw_normal cl_darkest lc0"
          :key="item.title"
        >
          {{ item.title.replace(/-0?/, "年") }}月
        </div>
        <div class="L_grid-conxs" :key="'mouth_box' + idx">
          <div
            class="L_grid-cell7 L_grid-cellxs ta_center"
            v-for="(_item, index) in item.prefixDays"
            :key="'day_pre' + idx + '_' + index"
          ></div>
          <div
            class="L_grid-cell7 L_grid-cellxs ta_center datePicker_cell"
            :class="_item.className"
            v-for="(_item, index) in item.dayArrs"
            :key="'day_' + idx + '_' + index"
            @click="selectDate(_item)"
          >
            <div class="datePicker_cell">
              <p class="datePicker_cell_top">
                {{ _item.topText }}
              </p>
              <p class="datePicker_cell_middle">
                {{ _item.day }}
              </p>
              <p>{{ _item.bottomText }}</p>
            </div>
          </div>
          <div
            class="L_grid-cell7 L_grid-cellxs ta_center"
            v-for="(_item, index) in item.appendDays"
            :key="'day_next' + idx + '_' + index"
          ></div>
        </div>
      </template>
    </color-scroll>
    <div class="datePicker_submit" :style="{ backgroundColor: '#fff' }">
      <div class="datePicker_submit_innerBox">
        <div>
          <div class="fs_l fw_medium cl_darkest lc0">
            {{ submitText }}
          </div>
          <div class="fs_m fw_normal cl_normal lc0">
            共&nbsp; {{ totalDay }} &nbsp;晚
          </div>
        </div>
        <div
          data-href=""
          class="datePicker_submit_button"
          :data-log="
            $utils.inject({
              control_name: '确认',
              control_position: 2,
              control_type: 'button',
            })
          "
          @click="submitDate"
        >
          确认
        </div>
      </div>
    </div>
  </Panel>
</template>

<script>
import dayjs from "dayjs";
import { browserInfo } from "@lego";
import { Panel } from "@components";
const isDark = browserInfo.theme !== 1;
export default {
  name: "HotelDatePick",
  props: {
    defaultDate: {
      type: String,
      default: "",
    },
    activeKeys: {
      type: Array,
      default: () => [],
    },
    // 选中显示的文案
    activeTips: {
      type: Array,
      default: () => ["入住", "离店"],
    },
    range: {
      type: Array,
      default: () => [0, 30],
    },
    type: {
      // 用来控制日历选择类型，single为单选，double为双选
      vaildator: (value) => ["double", "single"].includes(value),
      default: "double",
    },
    holidays: {
      type: Object,
      default() {
        return {};
      },
    },
    workdays: {
      type: Object,
      default() {
        return {};
      },
    },
    bottomTips: {
      type: Object,
      default() {
        return {};
      },
    },
    submitTip: {
      type: String,
      default: "请选择入离时间",
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Panel,
  },
  watch: {
    defaultDate(val, oldVal) {
      if (val !== oldVal) {
        this.initData();
      }
    },
    isShow() {
      if (this.visible !== this.isShow) {
        this.visible = this.isShow;
      }
    },
    visible() {
      if (this.visible !== this.isShow) {
        this.$emit("close");
      }
    },
  },
  computed: {
    // nowDate() {
    //   let nowDate;
    //   if (this.defaultDate) {
    //     let nowDate = new Date(this.defaultDate);
    //   }
    //   return dayjs(nowDate);
    // },
    totalDay() {
      const { cacheItem } = this;
      return cacheItem.length === 2 ? cacheItem[1]._idx - cacheItem[0]._idx : 0;
    },
    submitText() {
      if (this.totalDay) {
        return this.cacheItem
          .map((item) => {
            let dateList = item.date.split("-");
            return `${Number(dateList[1])}月${Number(dateList[2])}日`;
          })
          .join("-");
      } else {
        return this.submitTip;
      }
    },
  },
  data(vm) {
    return {
      boxHeight: window.screen.height * 0.5 + 14 + "px",
      isDark,
      begin: "",
      end: "",
      now: "",
      isBind: false,
      visible: false,
      cacheTips: ["", ""],
      cacheItem: [],
      ...vm.initData(),
      renderDateList: [],
      mapList: [],
      betweenList: [],
      dateStatus: {
        holiday: "datePicker_cell_holiday",
        workday: "datePicker_cell_workday",
        isOptLeft: "datePicker_cell_isOptList datePicker_active",
        isOptRight: "datePicker_cell_isOptRight datePicker_active",
        between: "datePicker_cell_between",
        disable: "datePicker_cell_disable",
      },
    };
  },
  methods: {
    getRenderDateList() {
      let rendDateList = [];
      const {
        activeKeys,
        activeTips,
        holidays,
        workdays,
        begin,
        end,
        now,
        type,
        bottomTips,
        cacheTips,
        dateStatus,
        mapList,
      } = this;
      const beginDay = begin.format("YYYY-MM-DD"); // 有效日期开始日
      const endDay = end.format("YYYY-MM-DD"); // 有效日期终止日
      const today = now.format("YYYY-MM-DD"); // 今天

      // 每一天中的元素；
      let bottomText = "", // 底部文案
        topText = "", // 顶部文案
        className = "", // 根据不同情况赋予不同的className值
        // cellClass = 'datePicker_cell datePicker_cell_enable',
        // chooseClass = 'ta_center',
        // topClass = 'datePicker_cell_top_holiday',
        // middleClass = 'datePicker_cell_middle_workday',
        // bottomClass = '',
        isChoose = false,
        disable = false,
        between = false,
        _dateStatus = "",
        DD = "", // 日期-天
        date = "",
        day = "",
        holidayText = "",
        workdayText = "",
        _idx = -1;
      this.dateRange().forEach((item) => {
        const dateKey = item.format("YYYY-MM");
        const days = item.endOf("month").date(); // 每月天数
        let firstDay = item.startOf("month").day(); // 第一天星期
        const lastDay = item.endOf("month").day(); // 最后一天星期
        firstDay = firstDay === 0 ? 7 : firstDay;
        const prefixDays = []; // 补齐前面
        for (let i = 0; i < firstDay; i += 1) {
          prefixDays.push("pre");
        }
        const appendDays = []; // 补齐后面
        for (let i = 0; i < lastDay; i += 1) {
          appendDays.push("last");
        }
        const dayArrs = [];
        for (let i = 1; i <= days; i += 1) {
          _idx++;
          DD = `-${i.toString().padStart(2, "0")}`;
          date = dateKey + DD;

          // 临时变量
          holidayText = holidays[date]; // 当前假期文案，无则不是节日
          workdayText = workdays[date]; // 当前特别指定工作日，无则走正常规则

          disable = date < beginDay || date > endDay; // 是否禁止选中
          isChoose = activeKeys.includes(date); // 当前是否选中

          between = date > activeKeys[0] && date < activeKeys[1]; // 是否为中间态

          // 确定上中下p标签内的文案
          topText = holidayText || workdayText;
          day = date === today ? "今天" : i;
          bottomText = bottomTips[date];
          _dateStatus = "";
          className = "";
          // 初始化class
          // cellClass = 'datePicker_cell datePicker_cell_enable';
          // chooseClass = 'ta_center';
          // topClass = 'datePicker_cell_top_holiday';
          // middleClass = 'datePicker_cell_middle_workday';

          // 周末 && 特别指定的节假日,firstDay-1为修正后前面的空格
          if (
            (i + firstDay - 1) % 7 === 0 ||
            (i + firstDay) % 7 === 0 ||
            holidayText
          ) {
            // middleClass = 'datePicker_cell_middle_weekend';
            className = dateStatus.holiday;
            _dateStatus = "holiday";
          }

          // 特别指定的工作日
          if (workdayText) {
            // topClass = 'datePicker_cell_top_workday';
            // middleClass = 'datePicker_cell_middle_workday';
            className = dateStatus.workday;
            _dateStatus = "workday";
          }
          // 选中态
          if (isChoose) {
            // topClass = 'datePicker_cell_top_active';
            // middleClass = 'datePicker_cell_middle_active';
            // chooseClass = 'datePicker_active ta_center ';
            if (type === "double") {
              if (date === activeKeys[0]) {
                cacheTips[0] = bottomText;
                // chooseClass += ' datePicker_active_begin';
                className = dateStatus.isOptLeft;
                bottomText = activeTips[0];
              } else {
                // chooseClass += ' datePicker_active_end';
                cacheTips[1] = bottomText;
                className = dateStatus.isOptRight;
                bottomText = activeTips[1];
              }
            }
            // bottomClass = 'datePicker_cell_bottom_active';
            // 中间态
          } else if (between) {
            className = dateStatus.between;
            // middleClass = 'datePicker_cell_middle_between';
            // chooseClass = 'datePicker_between ta_center';
          }

          // 不可选中态，一定要放在最后
          if (disable) {
            className = dateStatus.disable;
            // cellClass = 'datePicker_cell datePicker_cell_disable';
            // topClass = 'datePicker_cell_top';
            // middleClass = 'datePicker_cell_middle_workday';
          }
          let result = {
            day,
            _day: i,
            bottomText,
            topText,
            className,
            dateStatus: _dateStatus,
            // middleClass,
            // topClass,
            // middleClass,
            // chooseClass,
            date,
            disable,
            _idx,
          };
          if (isChoose) this.cacheItem.push(result);
          mapList.push(result);
          dayArrs[i - 1] = result;
        }

        rendDateList.push({
          prefixDays,
          dayArrs,
          appendDays,
          title: dateKey,
        }); // 每月结果
      });
      return rendDateList;
    },
    bgHide() {
      event.target === event.currentTarget && this.Hide();
    },
    Hide() {
      this.visible = false;
    },
    dateRange() {
      const { begin, end } = this;
      let tmpBegin = begin;
      const allMonths = [];
      while (tmpBegin.format("YYYY-MM") <= end.format("YYYY-MM")) {
        allMonths.push(tmpBegin);
        tmpBegin = tmpBegin.add(1, "month");
      }
      return allMonths;
    },
    initData() {
      const { defaultDate, range } = this;
      let nowDate = "";
      if (defaultDate) {
        nowDate = new Date(defaultDate);
      }
      const _now = dayjs(nowDate);
      const begin = _now.subtract(range[0], "day"),
        end = _now.add(range[1], "day"),
        now = dayjs(new Date());
      return { begin, end, now };
    },
    formatDate(date) {
      return `${dayjs(date).format("M-D").replace("-", "月")}日`;
    },
    selectDate(item) {
      if (item.disable) {
        return;
      }
      let {
        dateStatus,
        cacheItem,
        mapList,
        betweenList,
        cacheTips,
        activeTips,
      } = this;
      if (this.type === "single") {
        let _item = cacheItem.pop();
        _item.className = dateStatus[_item.dateStatus];
        cacheItem.push(item);
      } else {
        if (cacheItem.length == 2) {
          cacheItem.forEach((_item, idx) => {
            _item.className = dateStatus[_item.dateStatus];
            _item.bottomText = cacheTips[idx];
          });
          betweenList.forEach((_item) => {
            _item.className = dateStatus[_item.dateStatus];
          });
          item.className = dateStatus.isOptLeft;
          this.cacheItem = [item];
          this.cacheTips = [item.bottomText];
          item.bottomText = activeTips[0];
        } else {
          if (cacheItem[0]._idx === item._idx) {
            return;
          } else if (item._idx < cacheItem[0]._idx) {
            cacheItem.unshift(item);
            cacheTips.unshift(item.bottomText);
            cacheItem[1].className = dateStatus.isOptRight;
            cacheItem[1].bottomText = activeTips[1];
            item.className = dateStatus.isOptLeft;
            item.bottomText = activeTips[0];
          } else {
            cacheItem.push(item);
            cacheTips.push(item.bottomText);
            item.className = dateStatus.isOptRight;
            item.bottomText = activeTips[1];
          }
          // 遍历中间时间对象
          let item_idx = cacheItem[1]._idx;
          for (let _idx = cacheItem[0]._idx + 1; _idx < item_idx; ++_idx) {
            mapList[_idx].className = dateStatus.between;
            betweenList.push(mapList[_idx]);
          }
        }
      }
    },
    submitDate() {
      const { cacheItem, totalDay } = this;
      if (cacheItem[0] && cacheItem[1]) {
        const selectedDate = [cacheItem[0].date, cacheItem[1].date];
        this.$emit("getSelectDate", { selectedDate, totalDay });
      }
      this.Hide();
    },
  },
  created() {
    this.renderDateList = this.getRenderDateList();
  },
};
</script>

<style lang="scss">
// .datePicker_wrapBox {
//   width: 100%;
//   height: 100%;
//   position: fixed;
//   z-index: 100;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: rgba(0, 0, 0, 0.5);

.datePicker_headerBox_title {
  padding: 19px 0px;
}

.datePicker_headerBox_close {
  position: absolute;
  top: 16px;
  right: 22px;
  width: 24px;
  height: 24px;
  background-image: url("https://prod-search.nearme.com.cn/search/uploads/datePicker_cancel.png.webp");
  background-size: cover;
  background-color: transparent;
}

.datePicker_headerBox_grid {
  font-size: 14px;
  padding: 8px 0px 15px 0px;
}
.L_grid-cell7 {
  box-sizing: border-box;
  width: 14.285714%;
}
.L_grid-cellxs {
  padding: 5px 4px;
}
//   .datePicker_contentBox {
//     width: 100%;
//     position: fixed;
//     left: 0;
//     bottom: 0;
//     overflow: hidden;
//     overflow-y: auto;
//     z-index: 777;
//   }

.datePicker_submit {
  width: 100%;
  height: 84px;
  // position: fixed;
  // left: 0;
  // bottom: 0;
  // z-index: 999;
  box-shadow: 0 -6px 12px 0 rgba(0, 0, 0, 0.06);

  .datePicker_submit_innerBox {
    padding: 20px 24px;
    justify-content: space-between;
    display: flex;
    flex: 1;
  }

  .datePicker_submit_button {
    width: 152px;
    text-align: center;
    height: 44px;
    line-height: 44px;
    background-color: #2660f5;
    color: #fff;
    font-size: 14px;
    border-radius: 10px;
    outline: none;
  }
}

.datePicker_division {
  padding: 8px 0px 8px 24px;
  background: rgba($color: #000000, $alpha: 0.06);
}

.datePicker_cell {
  font-size: 10px;
  p {
    height: 19px;
    line-height: 19px;
  }
}

//   .datePicker_cell_enable {
//     color: #333;
//     font-size: 10px;

//     .datePicker_cell_top_holiday {
//       color: #ff6436;
//     }

//     .datePicker_cell_top_workday {
//       color: rgba($color: #000, $alpha: 0.3);
//     }

//     .datePicker_cell_top_active {
//       color: #fff;
//     }

//     .datePicker_cell_middle_workday {
//       color: #333;
//       font-size: 16px;
//     }

.datePicker_cell_holiday {
  color: #ff6436;
  font-size: 16px;
}
.datePicker_cell_middle {
  font-size: 16px;
}
//     .datePicker_cell_middle_between {
//       color: #2660F5;
//       font-size: 16px;
//     }

//     .datePicker_cell_middle_active {
//       color: #fff;
//       font-size: 16px;
//     }

//     .datePicker_cell_bottom_active {
//       color: #fff;
//     }
//   }

.datePicker_cell_disable {
  color: rgba($color: #333, $alpha: 0.3);
  font-size: 10px;
}
.datePicker_cell_top {
  color: rgba($color: #333, $alpha: 0.3);
}

//     .datePicker_cell_middle_workday {
//       color: rgba($color: #000, $alpha: 0.3);
//       font-size: 16px;
//     }

//     .datePicker_cell_middle_weekend {
//       color: rgba($color: #ff6436, $alpha: 0.3);
//       font-size: 16px;
//     }
//   }

.datePicker_active {
  color: white;
  background-color: #2660f5;
  border-radius: 5px;
}

.datePicker_cell_isOptList {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}

.datePicker_cell_isOptRight {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}

.datePicker_cell_between {
  color: #2660f5;
  background-color: rgba($color: #2660f5, $alpha: 0.1);
}

.fc_ff6436 {
  color: #ff6436;
}
//   .pb84 {
//     padding-bottom: 84px;
//   }

//   button {
//     padding: 0;
//     margin: 0;
//     border: 0;
//   }
// }
.L_grid-conxs {
  display: flex;
  flex-flow: row wrap;
  box-sizing: border-box;
}
</style>
