// ==UserScript==
// @name         导出物理实验课表
// @namespace    export_phyexp_schedule
// @version      0.1
// @description  download .ics file
// @author       You
// @match        *://10.133.22.200:7100/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand("导出当前物理实验课表",function(){
        const xhr=new XMLHttpRequest();
        xhr.open("POST","http://10.133.22.200:7100/XPK/StuCourseElective/LoadUsedLabCourses",true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange=function(){
            if (xhr.readyState===4&&xhr.status===200) {
                let content=
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:PHYEXP ${new Date().toLocaleString()}
TZID:Asia/Shanghai
X-WR-CALNAME:物理实验课程表
`;
                const downloadLink = document.createElement("a"),
                      phyexp=JSON.parse(xhr.responseText);
                for(let i=0;i<phyexp.rows.length;i++){
                    content+=
`BEGIN:VEVENT
SUMMARY:${phyexp.rows[i].CourseName} ${phyexp.rows[i].LabName}
LOCATION:物理实验中心${phyexp.rows[i].ClassRoom}
DESCRIPTION:${phyexp.rows[i].TeacherName} | ${phyexp.rows[i].Weeks}周 ${phyexp.rows[i].WeekName} ${phyexp.rows[i].TimePartName} ${phyexp.rows[i].ClassRoom} 座位号${phyexp.rows[i].SeatNo}
DTSTART:${phyexp.rows[i].ClassDate.replace(/(\w+)\/(\w+)\/(\w+)/,(all,y,m,d)=>y+m.padStart(2,'0')+d.padStart(2,"0")).substr(0,8)}T${phyexp.rows[i].StartTime.replace(":","")}00
DTEND:${phyexp.rows[i].ClassDate.replace(/(\w+)\/(\w+)\/(\w+)/,(all,y,m,d)=>y+m.padStart(2,'0')+d.padStart(2,"0")).substr(0,8)}T${phyexp.rows[i].EndTime.replace(":","")}00
UID:${phyexp.rows[i].TeacherID}-${phyexp.rows[i].Weeks}-${phyexp.rows[i].TimePartID}-${phyexp.rows[i].LabID}-${phyexp.rows[i].LabClassNo}
END:VEVENT
`;
                }
                content+=`END:VCALENDAR`;
                downloadLink.href = URL.createObjectURL(new Blob([content],{type:"text/plain"}));
                downloadLink.download = "物理实验课程表.ics";
                downloadLink.click();
            }
        };
        xhr.send("courseID=36&StuIds="+document.cookie.match(/(?<=COOKIES_KEY_USERNAME=)[0-9]+/)[0]+"&isBatch=0&SemesterID=14&page=1&rows=100");
    });
})();
