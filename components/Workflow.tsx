import React, { FC, ReactNode, useContext, useState } from "react";

const WorkflowContext = React.createContext<{
    currentIndex: number
    onMove: (nextIndex: number) => void
} | null>(null)

export interface WorkflowProps {
    currentIndex: number
    onMove: (nextIndex: number) => void
    children: ReactNode
}
const Workflow: FC<WorkflowProps> = ({
    currentIndex, onMove,
    children,
}) => {
    const contextValue = {
        currentIndex, onMove,
    }
    return (
        <WorkflowContext.Provider value={contextValue}>
            {children}
        </WorkflowContext.Provider>
    );
}

export default Workflow;

export interface WorkflowPageProps {
    index: number
    children: ReactNode
}
export const WorkflowPage: FC<WorkflowPageProps> = ({
    index, children,
}) => {
    const workflow = useContext(WorkflowContext)
    if (!workflow) throw new Error("invalid WorkflowPage . WorkflowPage must be wrapped by Workflow Component .")
    return (
        <>
            {workflow.currentIndex === index &&
                <>{children}</>
            }
        </>
    );
}


export function useWorkflow(initIndex: number = 0) {
    const [currentIndex, setCurrentIndex] = useState(initIndex)
    const onMove = (page: number) => setCurrentIndex(page)
    const onNext = () => setCurrentIndex(p => p + 1)
    const onBack = () => setCurrentIndex(p => p - 1)
    const workflowProps = {
        currentIndex,
        onMove,
    } as const
    return {
        currentIndex,
        onMove,
        onNext,
        onBack,
        workflowProps,
    }
}

const Test = () => {
    const { workflowProps, } = useWorkflow()
    const test = <>
        <Workflow {...workflowProps}>
            <WorkflowPage index={0}>
                hogei
            </WorkflowPage>
            <WorkflowPage index={0}>
                hogei
            </WorkflowPage>
        </Workflow>
    </>
}
