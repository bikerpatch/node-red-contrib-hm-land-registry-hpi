
module.exports = function (RED) {
	"use strict"

	const {
		openDataQuery
	} = require("../lib/hmlandregistry-opendata.js")

	function hmlrHpi(nodeIn) {

		RED.nodes.createNode(this, nodeIn)
		var node = this

		var valid = true

		function paramAssignment(param, msg) {

			return (msg[param] && ((typeof msg[param] === "string" && msg[param].length > 1) || (typeof msg[param] === "number" && msg[param] >= 0))) ? msg[param] : nodeIn[param]
		}

		if (valid) {
			this.on("input", async (msg, send, done) => {

				try {
					node.status({ fill: "blue", shape: "dot", text: "In progress" })

					var region = paramAssignment("region", msg)
					var periodFrom = paramAssignment("periodFrom", msg)
					var periodTo = paramAssignment("periodTo", msg)
					var page = paramAssignment("page", msg)
					var pageSize = paramAssignment("pageSize", msg)
					var view = paramAssignment("view", msg)
					var properties = paramAssignment("properties", msg)

					const apiResponse = await openDataQuery(
						region,
						periodFrom,
						periodTo,
						page,
						pageSize,
						view,
						properties
					)

					msg.payload = apiResponse.data.result.items
					msg.ukhpi = apiResponse

					send(msg)
					node.status({ fill: "green", shape: "dot", text: "Complete" })
					done()
					
				} catch (err) {
					msg.ukhpi = err
					msg.payload = err
					node.error(err, msg)
					node.status({ fill: "red", shape: "dot", text: "Error" })
					done(err)
				}
			})
		}
	}

	RED.nodes.registerType("hmlandregistry-ukhpi", hmlrHpi)
}
