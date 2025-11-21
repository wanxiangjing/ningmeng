import { Tabs } from "antd"
import Index from "./view/Ningmeng"
import KuaidiPage from "./view/Kuaidi"
import { useEffect, useState } from "react"

const App = () => {
    const [activeKey, setActiveKey] = useState('ningmeng')

    const handleClickTab = (key: string) => {
        setActiveKey(key)
        window.history.replaceState(null, '', location.origin + `?tab=${key}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        setActiveKey(tab || 'ningmeng');
    }, [])

    return <Tabs
        activeKey={activeKey}
        centered
        onTabClick={handleClickTab}
        items={[
            {
                key: 'ningmeng',
                label: '柠檬分选器',
                children: <Index />,
            },
            {
                key: 'kuaidi',
                label: '快递',
                children: <KuaidiPage />,
            },
        ]}
    />
}

export default App