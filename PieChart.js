// Sample data for the pie chart
var data = [
    { category: "Male - High BMI", count: 0 },
    { category: "Male - Low BMI", count: 0 },
    { category: "Female - High BMI", count: 0 },
    { category: "Female - Low BMI", count: 0 }
];

// Load the CSV data (assuming you have loaded and parsed your insurance dataset)
d3.csv("insurance.csv").then(function(dataset) {
    // Categorize individuals based on sex and BMI
    dataset.forEach(function(d) {
        var category = d.sex === "male" ? "Male" : "Female";
        category += " - " + (d.bmi >= 30 ? "High BMI" : "Low BMI");

        // Find the corresponding category and increment the count
        for (var i = 0; i < data.length; i++) {
            if (data[i].category === category) {
                data[i].count++;
                break;
            }
        }
    });

    // Calculate the total count
    var totalCount = d3.sum(data, function(d) { return d.count; });

    // Define dimensions and radius for the pie chart
    var width = 800;
    var height = 400;
    var radius = Math.min(width, height) / 2;

    // Create an SVG element for the pie chart
    var svg = d3.select("#pie-chart")
        .attr("width", width)
        .attr("height", height);

    // Create a group for the pie chart and center it
    var g = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Define a color scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // Define the pie layout
    var pie = d3.pie()
        .sort(null) // Disable sorting to keep the order of data
        .value(function(d) { return d.count; });

    // Create arcs for the pie slices
    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Create the pie chart slices
    var slices = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    // Draw the slices
    slices.append("path")
        .attr("d", arc)
        .attr("fill", function(d) { return color(d.data.category); });

    // Add labels to the slices with percentages, and move specific labels to the left
    slices.append("text")
        .attr("transform", function(d) {
            if (d.data.category === "Female - High BMI" || d.data.category === "Female - Low BMI") {
                // Move specific labels to the left
                return "translate(" + (arc.centroid(d)[0] - 170) + "," + arc.centroid(d)[1] + ")";
            } else if (d.data.category === "Male - High BMI" || d.data.category === "Male - Low BMI") {
                return "translate(" + (arc.centroid(d)[0] - 20) + "," + arc.centroid(d)[1] + ")";
            } else {
                return "translate(" + arc.centroid(d) + ")";
            }
        })
        .attr("dy", ".35em")
        .text(function(d) {
            var percentage = ((d.data.count / totalCount) * 100).toFixed(2) + "%";
            return d.data.category + " (" + percentage + ")";
        });
}).catch(function(error) {
    console.log(error);
});
