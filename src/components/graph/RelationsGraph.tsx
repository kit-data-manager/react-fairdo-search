import type { RelationNode } from "@/lib/RelationNode"

import { buildGraphForReferences } from "@/components/graph/helpers"
import { PlainNode } from "@/components/graph/PlainNode"
import { Background, BackgroundVariant, ReactFlow, useEdgesState, useNodesInitialized, useNodesState, useReactFlow } from "@xyflow/react"
import { useEffect, useMemo } from "react"
import "@xyflow/react/dist/style.css"

const nodeTypes = {
    plain: PlainNode
}

/**
 * Renders an interactive graph for the specified RelationNodes.
 * @param props
 * @constructor
 */
export function RelationsGraph(props: {
    /**
     * Source of the relation
     */
    source: RelationNode[]
    /**
     * Targets of the relation. Will be connected to the base (source) only
     */
    target: RelationNode[]
}) {
    const { initialEdges, initialNodes } = useMemo(() => {
        return buildGraphForReferences(props.source, props.target)
    }, [props.source, props.target])

    const [nodes, , onNodesChange] = useNodesState(initialNodes)
    const [edges, , onEdgesChange] = useEdgesState(initialEdges)
    const { fitView } = useReactFlow()
    const nodesInitialized = useNodesInitialized()

    useEffect(() => {
        if (nodesInitialized) {
            fitView().then()
        }
    }, [fitView, nodesInitialized])

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            proOptions={{ hideAttribution: true }}
        >
            <Background color="hsl(var(--rfs-border))" variant={BackgroundVariant.Lines} />
        </ReactFlow>
    )
}
