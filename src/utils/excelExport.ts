import { message } from "antd";
import ExportJsonExcel from "js-export-excel";
import { SafeAny } from "../types/Safe";

export interface IExcelOption extends SafeAny {
  sheetData?: SafeAny[];
  sheetName: string;
  sheetFilter?: string[];
  sheetHeader: string[];
  columnWidths?: number[];
  cellStyle?: {
    isWrap?: boolean; // 设置自动换行
  };
  rowHeight?: number;
}
export const data2Excel = (fileName: string, optionDatas: IExcelOption[]) => {
  try {
    const option: SafeAny = {}; //option代表的就是excel文件
    option.fileName = fileName; //excel文件名称
    option.datas = optionDatas;
    const toExcel = new ExportJsonExcel(option); //生成excel文件
    toExcel.saveExcel(); //下载excel文件
    message.success("数据导出成功");
  } catch (err) {
    message.error("导出出错,请刷新重试");
    console.log(err);
  }
};
