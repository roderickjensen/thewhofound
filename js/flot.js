$(function () {
	$('.container.main').css('display','block');
	$('.container.feltron').css('display','block');

	// we use an inline data source in the example, usually data would
    // be fetched from a server
    var data = [], totalPoints = 300;
    function getRandomData() {
        if (data.length > 0)
            data = data.slice(1);

        // do a random walk
        while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : 50;
            var y = prev + Math.random() * 10 - 5;
            if (y < 0)
                y = 0;
            if (y > 100)
                y = 100;
            data.push(y);
        }

        // zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < data.length; ++i)
            res.push([i, data[i]])
        return res;
    }

    // setup control widget
    var updateInterval = 1000;
    // setup plot
    var options = {
		lines: { fillColor: "#2f2f2f", fill: true },
		grid: {
			backgroundColor:  0,
			borderWidth: 0
		},
		colors: ["#ffd563"],
        series: { shadowSize: 0 }, // drawing is faster without shadows
        yaxis: { min: 0, max: 100 },
        xaxis: { show: false, color: "#ffffff" }
    };
    var plot = $.plot($("#placeholder"), [ getRandomData() ], options);

    function update() {
        plot.setData([ getRandomData() ]);
        // since the axes don't change, we don't need to call plot.setupGrid()
        plot.draw();

        setTimeout(update, updateInterval);
    }

    update();
});