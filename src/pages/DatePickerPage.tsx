import React from "react";
import { PageHeader, ShowcaseCard } from "@/components/ui/Showcase";
import { type DateRange } from "react-day-picker";
import { DatePicker } from "@components/ui/datepicker/DatePicker";

const DatePickerPage = () => {
  const [single, setSingle] = React.useState<Date | undefined>();
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [dt1, setDt1] = React.useState<Date | undefined>();
  const [dt2, setDt2] = React.useState<Date | undefined>();
  const [time, setTime] = React.useState("");
  const [future, setFuture] = React.useState<Date | undefined>();
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="DatePicker"
        description="Bộ chọn ngày tháng đầy đủ tính năng."
      />

      <ShowcaseCard title="Single Date">
        <DatePicker
          label="Ngày sinh"
          value={single}
          onChange={(d) => setSingle(d as Date | undefined)}
          placeholder="Chọn ngày..."
        />
      </ShowcaseCard>

      <ShowcaseCard title="Date Range">
        <DatePicker
          mode="range"
          label="Khoảng thời gian"
          value={range}
          onChange={(d) => setRange(d as DateRange | undefined)}
          placeholder="Từ — Đến"
        />
      </ShowcaseCard>

      <ShowcaseCard title="Chặn Ngày Quá Khứ">
        <DatePicker
          label="Lịch hẹn"
          value={future}
          onChange={(d) => setFuture(d as Date | undefined)}
          disablePastDates
          placeholder="Chỉ ngày tương lai..."
        />
      </ShowcaseCard>

      <ShowcaseCard title="DateTime — Giờ : Phút : Giây">
        <DatePicker
          label="Ngày & Giờ"
          showTime
          value={dt1}
          onChange={(d) => setDt1(d as Date | undefined)}
          placeholder="Chọn ngày giờ..."
        />
      </ShowcaseCard>

      <ShowcaseCard title="DateTime — Giờ : Phút">
        <DatePicker
          label="Cuộc họp"
          showTime
          timeFormat="HH:mm"
          value={dt2}
          onChange={(d) => setDt2(d as Date | undefined)}
          placeholder="Chọn ngày giờ..."
        />
      </ShowcaseCard>

      <ShowcaseCard title="Chỉ chọn giờ">
        <DatePicker
          label="Giờ báo thức"
          mode="time-only"
          timeFormat="HH:mm"
          timeValue={time}
          onTimeChange={setTime}
          onChange={() => undefined}
          placeholder="Chọn giờ..."
        />
      </ShowcaseCard>
    </div>
  );
};

export default DatePickerPage;
