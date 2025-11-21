import { Button, Flex, Input, message } from "antd";
import { useEffect, useState } from "react";
import './index.scss'
import useApp from "antd/es/app/useApp";

const KuaidiPage = () => {
    const [kuaidiList, setKuaidiList] = useState<string[]>(['YT2'])
    const [prefix, setPrefix] = useState<string>('YT2')
    const { modal } = useApp()

    const handleChangePreFix = (e: string) => {
        localStorage.setItem('kuaidi-prefix', e)
        setPrefix(e)
    }
    const handleChangeKuaidiList = (value: string[]) => {
        localStorage.setItem('kuaidi-list', JSON.stringify(value))
        setKuaidiList(value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Enter' || e.key === 'ArrowDown') {
            e.preventDefault()
            if (index === kuaidiList.length - 1) {
                kuaidiList.push(prefix)
                handleChangeKuaidiList([...kuaidiList])
            }
            setTimeout(() => {
                const elements = document.querySelectorAll(`#${(e.target as HTMLInputElement).id}`) as NodeListOf<HTMLInputElement>
                elements[index + 1].focus()
            })
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            const elements = document.querySelectorAll(`#${(e.target as HTMLInputElement).id}`) as NodeListOf<HTMLInputElement>
            elements[index - 1].focus()
        }
    }

    const handleReset = () => {
        modal.confirm({
            title: '重置',
            content: '是否重置？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                handleChangePreFix('YT2')
                handleChangeKuaidiList(['YT2'])
            }
        })
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(kuaidiList.join('\n'))
        message.success('复制成功')
    }

    useEffect(() => {
        const prefix = localStorage.getItem('kuaidi-prefix') || 'YT2'
        const kuaidiList = JSON.parse(localStorage.getItem('kuaidi-list') || '["YT2"]')
        setPrefix(prefix)
        setKuaidiList(kuaidiList)
    }, [])

    return <div className="kudi-page-container">
        <div className="section">
            <div className="title">输入：<Button onClick={handleReset}>重置</Button></div>
            <Flex align="center" style={{ width: 300 }}><div style={{ width: 100 }}> 固定前缀：</div><Input value={prefix} onChange={(e) => handleChangePreFix(e.target.value)} /></Flex>
            <ul className="kuaidi-list">
                {kuaidiList.map((item, index) => <Flex key={'kuaidi' + index} align="center" style={{ width: 400 }}>
                    <div style={{ width: 100 }}>单号{index + 1}：</div>
                    <Input id="kuaidiInput" onKeyDown={e => handleKeyDown(e, index)} value={item} onChange={(e) => {
                        kuaidiList[index] = e.target.value
                        handleChangeKuaidiList([...kuaidiList])
                    }} />
                    <Button type="link" danger onClick={() => {
                        modal.confirm({
                            title: '删除',
                            content: '是否删除？',
                            okText: '确定',
                            cancelText: '取消',
                            onOk: () => {
                                kuaidiList.splice(index, 1)
                                handleChangeKuaidiList([...kuaidiList])
                            }
                        })
                    }}>删除</Button>
                </Flex>)}
            </ul>
        </div>
        <div className="section">
            <div className="title">结果：<Button onClick={handleCopy}>复制</Button></div>
            <div className="kuaidi-result">
                {kuaidiList.map((item, index) => <div key={'kuaidi' + index}>{item}</div>)}
            </div>
        </div>
    </div>
}

export default KuaidiPage;