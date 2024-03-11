        // based ready dom, initialize echarts instance 
		var myChart = echarts.init(document.getElementById('main'));

        // Specify configurations and data graphs 
        var option = {
    title : {
        text: 'Plenty of calls',
        subtext: 'Turving opdracht',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        x : 'center',
        y : 'bottom',
        data:['Call 1','Call 2','Call 3','Call 4','Call 5','Call 6','Call 7','Call 8','Call 9','Call 10','Call 11','Call 12','Call 13','Call 14','Call 15']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {
                show: true,
                type: ['pie', 'funnel']
            },
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    series : [
        {
            name:'Area Mode',
            type:'pie',
            radius : [30, 110],
            center : ['50%', 200],
            roseType : 'area',
            data:[
                {value:6, name:'Call 1'},
                {value:1, name:'Call 2'},
                {value:17, name:'Call 3'},
                {value:13, name:'Call 4'},
                {value:58, name:'Call 5'},
                {value:1, name:'Call 6'},
                {value:60, name:'Call 7'},
                {value:1, name:'Call 8'},
                {value:36, name:'Call 9'},
                {value:120, name:'Call 10'},
                {value:30, name:'Call 11'},
                {value:60, name:'Call 12'},
                {value:3, name:'Call 13'},
                {value:120, name:'Call 14'},
                {value:1, name:'Call 15'},
            ]
        }

        
    ]
};

		// Use just the specified configurations and data charts. 
		myChart.setOption(option);