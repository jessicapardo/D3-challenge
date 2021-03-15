// @TODO: YOUR CODE HERE!

function makeResponsive() {

    // if the SVG area isn't empty when the browser loads, remove it
    // and replace it with a resized version of the chart
    let svgArea = d3.select("body").select("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // SVG wrapper dimensions are determined by the current width
    // and height of the browser window.
    let svgWidth = 800;
    let svgHeight = 550;


    // Set up margins
    let margin = {
        top: 20,
        right: 20,
        bottom: 80,
        left: 100
    };

    // Create width and height parameters based on SVG margins (left and right)
    let width = svgWidth - margin.left - margin.right;
    let height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    let svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append an SVG group
    let chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // append text element
    let circlesTextGroup = chartGroup.append("g")

    // data
    d3.csv("assets/data/data.csv").then(successHandler, errorHandler);

    function errorHandler(error) {
        throw err;
    }

    function successHandler(healthData) {
        // Parse Data/Cast as numbers
        // ==============================
        healthData.forEach(data => {
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
            data.abbr = data.abbr;
            data.income = +data.income;
            data.state = data.state;
        });

        // Create scale functions
        // ==============================
        let xLinearScale = d3.scaleLinear()
            .domain([8.5, d3.max(healthData, d => d.poverty)])
            .range([0, width]);

        let yLinearScale = d3.scaleLinear()
            .domain([3.5, d3.max(healthData, d => d.healthcare)])
            .range([height, 0]);

        // Create axis functions
        // ==============================python -m http.server 8000 --bind 127.0.0.1
        let bottomAxis = d3.axisBottom(xLinearScale);
        let leftAxis = d3.axisLeft(yLinearScale);

        // Append Axes to the chart
        // ==============================
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        // Initialize toolTip
        // ==============================
        let toolTip = d3
            .tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function (d) {
                return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
            });

        vis = chartGroup
            .append('svg')
            .call(toolTip);


        // Create Circles for scatter plot
        // =======================================
        let circlesGroup = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .text(d => d.abbr)
            .attr("r", "18")
            .attr('class', 'stateCircle')
            .attr("opacity", "0.5");



        // Append text to circles and toolTip
        let textGroup = circlesTextGroup
            .selectAll('#stateCircle')
            .data(healthData)
            .enter()
            .append("text")
            .attr("x", d => (xLinearScale(d.poverty) - 10))
            .attr("y", d => (yLinearScale(d.healthcare) + 5))
            .text(d => (d.abbr));
        

        // Create tooltip in the chart
        // ==============================
        chartGroup.call(toolTip);

        // Create event listeners to show and hide the tooltip
        // ==============================
        circlesGroup.on("mouseover", toolTip.show)
            .on("mouseout", toolTip.hide);

        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("In Poverty (%)");
    }
}

// When the browser loads, makeResponsive() is called.
makeResponsive();