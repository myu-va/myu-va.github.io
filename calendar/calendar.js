"use strict";
/*
必要な設定
html設定
table id=calendar
script defer

style設定
colgroup class=calendar_colgroup
col calendar_col
caption class=calendar_caption
thead class=calendar_thead
th class=calendar_th
th:not(:first-child,:last-child)
td class=calendar_td
.holiday
.other_month
.other_monthH
*/
function calendar() {
    let table,
        cap,
        now,
        year,
        month,
        date,
        dates,
        day,
        thead,
        tbody,
        oneday,
        reiwa;
    let days = ["日","月","火","水","木","金","土"];
    let x=[];

    now = new Date();
    year = now.getFullYear(); // 西暦
    month = now.getMonth() + 1; //0~11
    date = now.getDate(); //1~
    day = now.getDay(); //0~6(sun~sat)
    reiwa = "令和" + (year - 2019 + 1); //和暦　令和は2019年から
    month=10;
    function headcap() {
        table = document.querySelector(".calendar");
        cap = document.createElement("caption");
        let colgroup = document.createElement("colgroup");
        let col = document.createElement("col");
        colgroup.appendChild(col);
        // captionの文
        cap.textContent = `${year}年${month}月`; //一応令和もある=reiwa
        cap.className = "calendar_caption";
        // theadの作成
        thead = document.createElement("thead");
        thead.className = "calendar_thead";
        let tr = document.createElement("tr");
        for(let i=0;i<days.length;i++){
            let j = document.createElement("th");
            j.className = "calendar_th";
            j.textContent = days[i];
            j.scope = "col";
            tr.appendChild(j);
        }
        table.appendChild(cap);
        table.appendChild(colgroup);
        thead.appendChild(tr);
        table.appendChild(thead);
    }

    function calendar_table() {
    // カレンダー本体のテーブル
        tbody = document.createElement("tbody");
        for(let i=0;i<5;i++){
            let tr = document.createElement("tr");
            for(let j=0;j<days.length;j++){
                let td = document.createElement("td");
                td.textContent = "0";
                td.className = "calendar_td"
                td.id = "td" + String(i) + String(j);
                x.push("td" + String(i) + String(j));
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
            table.appendChild(tbody);
            //日曜日
            if(x[i*7] == "td" + i + "0"){
                document.getElementById(x[i*7]).className = "holi";
            }
        }
    }

    function where_one() {
        // 現在の月の1日が何曜日か        
        let remainder = date % 7;
        oneday = day - remainder + 1;
        switch(oneday) {
            case 0:
            case 7:
                oneday = 0; // 日
                break;
            case 1:
                oneday = 1; // 月
                break;
            case 2:
            case -5:
                oneday = 2; // 火
                break;
            case 3:
            case -4:
                oneday = 3; // 水
                break;
            case 4:
            case -3:
                oneday = 4; // 木
                break;
            case 5:
            case -2:
                oneday = 5; // 金
                break;
            case 6:
            case-1:
                oneday = 6; // 土
                break;
            default:
                table.removeChild(tbody);
                table.removeChild(thead);
                cap.textContent += `${date}日`;
                table.width = "200";
                break;
        }
    }

    function month_days() {
        // 月ごとの日数
        switch (month){
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                dates=31;
                break;
            case 2:
                dates=28;
                if(year%4==0){
                    dates=29;
                }
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                dates=30;
                break;
        }
    }

    function calendar_num() {
        // 先月分
        for(let i=0;i<oneday;i++){
            let j = document.getElementById(x[i]);
            j.textContent = dates-oneday+i+1;
            if(i==1 || i==2 || i==3 || i==4 || i==5){
            j.className += " other_month";
            } else {
            j.className += " other_monthH";//保留
            }
        }

        // 今月分
        for(let i=0;i<dates;i++){
            let j = document.getElementById(x[oneday]);
            j.textContent = i+1;
            if(i+1 == date){
                //今日
                j.className += " now";  
            }
            oneday++;
        }
        oneday = oneday-dates; //元に戻す
        
        //来月分
        let next = x.length-dates-oneday; //余ってるマス
        for(let i=0; i<next; i++){
            document.getElementById(x[x.length-next+i]).textContent = i+1;
            document.getElementById(x[x.length-next+i]).className += " other_month";
        }
    }

    function holiday() {
        // 休日
        switch(month) {
            case 1:
                holiname("元日",1);
                // 第二月曜日が休み
                monday("成人の日",8);
                break;
            case 2:
                holiname("天皇誕生日",23);
                holiname("建国記念の日",11);
                break;
            case 3:
                //年によって変わるので注意。現在2024
                holiname("春分の日",21);
                break;
            case 4:
                holiname("昭和の日",29);
                break;
            case 5:
                holiname("憲法記念日",3);
                holiname("みどりの日",4);
                holiname("こどもの日",5);
                break;
            case 7:
                // 第三月曜日
                monday("海の日",15);
                break;
            case 8:
                holiname("山の日",11);
                break;
            case 9:
                // 第三月曜日
                monday("敬老の日",15);
                //年によって変わるので注意。現在2023
                holiname("秋分の日",23);
                break;
            case 10:
                // 第二月曜日
                monday("スポーツの日",8);
                break;
            case 11:
                holiname("文化の日",3);
                holiname("勤労感謝の日",23);
                break;
        }
    }

    function holiname(name,date) {
        document.getElementById(x[oneday+date-1]).className = "holi";
        document.getElementById(x[oneday+date-1]).title = name;
    }

    function monday(name,day) {
        if( oneday == 0 ||  oneday == 1) {
            document.getElementById(x[day]).className = "holi";
            document.getElementById(x[day]).title = name;
        } else {
            document.getElementById(x[day+7]).className = "holi";
            document.getElementById(x[day+7]).title = name;
        }
    }    

    function holidaychange() {
        let holis = document.getElementsByClassName("holi");
        for(let i=0;i<holis.length;i++){
            if(holis[i].title != "") {
                if(
                    holis[i].id == "td00" || 
                    holis[i].id == "td10" || 
                    holis[i].id == "td20" ||
                    holis[i].id == "td30" ||
                    holis[i].id == "td40"
                ){
                    let j = Number(holis[i].id.slice(2,4));
                    holigiro(j);
                }
            }
        }
    }

    function holigiro(id) {
        console.log("td"+(id+1));
        if(document.getElementById("td"+(id+1)).className == "holi") {
            holigiro(id + 1);
        } else {
            document.getElementById("td"+(id+1)).className = "holi";
            document.getElementById("td"+(id+1)).title = "振替休日";
        }
    }

    headcap();
    calendar_table();
    where_one();
    month_days();
    calendar_num();
    holiday();
    holidaychange();
}

calendar();
