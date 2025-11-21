import { useEffect, useMemo, useState } from 'react'
import './index.scss'
import { App, Button, Divider, Flex, Image, Input, InputNumber, message, Table, TableProps, Tag, Tooltip } from 'antd'
import useLoveClick from '../../hooks/useLoveClick'
import { SafeAny } from '../../types/Safe'


interface Data {
    name: string,
    weight: number,
}
//18 缺陷果
// 17  <40g
// 14  >190g
// 13  黄果小果
// 12  黄果大中果
// 11  花皮小果
// 10  花皮大中果
// 09  阴枝果小果
// 08  阴枝果大中果
// 07  太阳果小果
// 06  太阳果大中果
// 05  花皮小果
// 04  花皮大中果
// 03  小果一级
// 02  中果一级
// 01  大果一级
const ningmengdengji = [
    "01 大果一级",
    "02 中果一级",
    "03 小果一级",
    "04 花皮大中果",
    "05 花皮小果",
    "06 太阳果大中果",
    "07 太阳果小果",
    "08 阴枝果大中果",
    "09 阴枝果小果",
    "10 花皮大中果",
    "11 花皮小果",
    "12 黄果大中果",
    "13 黄果小果",
    "14 >190g",
    "17 <40g",
    "18 缺陷果"
]
const initguoyuanbu = () => {
    return Array.from({ length: 8 }, (_, index) => {
        return { name: `果源部${index + 1}`, weight: 0 }
    })
}

const initningmengdengji = () => {
    return ningmengdengji.map((item) => {
        return { name: item, weight: 0 }
    })
}

const tableColumns: TableProps['columns'] = [
    {
        title: '时间',
        //2025.4.1形式，现在的时间
        dataIndex: 'time',
        key: 'time',
        width: 100
    },
]

ningmengdengji.forEach((item, index) => {
    tableColumns.push({
        title: item.slice(3),
        dataIndex: `ningmeng${index + 1}`,
        key: `ningmeng${index + 1}`,
        width: 100,
    })
})
tableColumns.push({
    title: '实际重量',
    dataIndex: 'realTotal',
    key: 'realTotal',
    width: 100,
})
tableColumns.push({
    title: '果源部',
    dataIndex: 'name',
    key: 'name',
    width: 100
})

//公斤 kg
const Index = () => {
    const [ningmengdengjiList, setNimengdengjiList] = useState<Data[]>(initningmengdengji)
    const [guoyuanbuList, setGuoyuanbuList] = useState<Data[]>(initguoyuanbu)
    const [actionKey, setActionKey] = useState(-1)
    const [actionKey2, setActionKey2] = useState(-1)
    const [allAction1, setAllAction1] = useState(false)
    const [allAction2, setAllAction2] = useState(false)
    const { modal } = App.useApp()

    useLoveClick()

    const totalWeight = guoyuanbuList.reduce((prev, item) => {
        return prev + item.weight as number
    }, 0)

    const totalNingmengWeight = ningmengdengjiList.reduce((prev, item) => {
        return prev + item.weight as number
    }, 0)

    const tabelData = useMemo(() => {
        return guoyuanbuList.map((item, index) => {
            const data: SafeAny = {
                key: 'guoyuan' + index,
                name: item.name,
                weight: item.weight,
                realTotal: 0,
            }
            const date = new Date()
            data.time = date.getUTCFullYear() + '.' + (date.getUTCMonth() + 1) + '.' + date.getUTCDate()
            ningmengdengjiList.forEach((item2, index2) => {
                const weight = Number((item2.weight * (item.weight / totalWeight)).toFixed(1))
                if (weight > 0) {
                    data[`ningmeng${index2 + 1}`] = weight
                    data.realTotal += weight
                } else {
                    data[`ningmeng${index2 + 1}`] = 0
                }
            })
            data.realTotal = Number(data.realTotal.toFixed(1))
            return data
        })
    }, [ningmengdengjiList, guoyuanbuList, totalWeight])

    console.log(tabelData);


    const handleDelete = (index: number) => {
        guoyuanbuList.splice(index, 1)
        handleSetGuoyuanbuList([...guoyuanbuList])
    }

    const handleAdd = () => {
        guoyuanbuList.push({ name: `果源部${guoyuanbuList.length + 1}`, weight: 0 })
        handleSetGuoyuanbuList([...guoyuanbuList])
    }

    const checkAllAction = (type: number) => {
        if (type === 1) {
            setAllAction1((prev) => !prev)
            setActionKey(-1)
        } else {
            setAllAction2((prev) => !prev)
            setActionKey2(-1)
        }
    }

    const handleSetGuoyuanbuList = (data: Data[]) => {
        setGuoyuanbuList(data)
        localStorage.setItem('guoyuanbuList', JSON.stringify(data))
    }

    const handleSetNimengdengjiList = (data: Data[]) => {
        setNimengdengjiList(data)
        localStorage.setItem('ningmengdengjiList', JSON.stringify(data))
    }

    const handleNumKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Enter' || e.key === 'ArrowDown') {
            const elements = document.querySelectorAll(`#${(e.target as HTMLInputElement).id}`) as NodeListOf<HTMLInputElement>
            elements[index + 1].focus()
        }
        if (e.key === 'ArrowUp') {
            const elements = document.querySelectorAll(`#${(e.target as HTMLInputElement).id}`) as NodeListOf<HTMLInputElement>
            elements[index - 1].focus()
        }
    }

    const selectAllTableCells = () => {
        const table = document.querySelector('table');
        if (!table) return;

        // 获取所有 <td> 元素
        const allTd = table.querySelectorAll('td');
        if (allTd.length === 0) return;

        // 创建一个 Range 对象
        const range = document.createRange();

        // 选中第一个 <td> 的内容
        range.selectNodeContents(allTd[0]);

        // 扩展选中范围到所有 <td>
        for (let i = 1; i < allTd.length; i++) {
            //   range.setStartAfter(allTd[0]);
            range.setEndAfter(allTd[i]);
        }

        // 清除当前选中状态（如果有）
        window.getSelection()?.removeAllRanges();
        // 添加新的选中范围
        window.getSelection()?.addRange(range);
        copySelectedText().then(() => {
            window.getSelection()?.removeAllRanges();
        })
    };

    async function copySelectedText() {
        try {
            // 获取当前选中的文本
            const selectedText = window.getSelection()?.toString();
            if (selectedText) {
                // 使用Clipboard API写入剪贴板
                await navigator.clipboard.writeText(selectedText);
                message.success('复制成功');
            } else {
                message.warning('没有选中任何内容');
            }
        } catch (err) {
            message.error(`复制失败:${err}`);
        }
    }
    useEffect(() => {
        const guoyuanbuList = localStorage.getItem('guoyuanbuList')
        const ningmengdengjiList = localStorage.getItem('ningmengdengjiList')
        if (guoyuanbuList) {
            setGuoyuanbuList(JSON.parse(guoyuanbuList))
        }
        if (ningmengdengjiList) {
            setNimengdengjiList(JSON.parse(ningmengdengjiList))
        }
    }, [])

    return <div style={{ position: 'relative' }}>
        <div className='top-bar'>
            {/* <Button type='primary'>导出</Button> */}
            <Image width={100} src='/dance1.gif' />
            {/* <Image width={100} src='/dance2.gif'/> */}
        </div>
        <div className='index-container'>
            <div className='section'>
                <div className='section-title'>
                    🐒果源部-总果量{totalWeight}kg
                    <Button onClick={() => checkAllAction(1)}>全部{allAction1 ? '收起' : '展开'}</Button>
                    <Button type='primary' onClick={() => {
                        modal.confirm({
                            title: '重置',
                            content: '重置后所有数据将被清空，是否继续？',
                            onOk() {
                                handleSetGuoyuanbuList(initguoyuanbu())
                            }
                        })
                    }}>重置</Button>
                </div>
                <ul className='list'>
                    {guoyuanbuList.map((item, index) => {
                        return <>
                            <li key={index} className='item'>
                                <div style={{ width: 20 }}>{index + 1}:</div>
                                <Input value={item.name} width={100} allowClear className='input' onChange={(e) => {
                                    guoyuanbuList[index].name = e.target.value
                                    handleSetGuoyuanbuList([...guoyuanbuList])
                                }} />:
                                <InputNumber id='guoyuan-num' onKeyDown={(e) => handleNumKeyDown(e, index)} keyboard={false} value={item.weight} onChange={(e) => {
                                    guoyuanbuList[index].weight = e as number
                                    handleSetGuoyuanbuList([...guoyuanbuList])
                                }} />kg
                                <div style={{ width: 120 }}>占比：{((item.weight / totalWeight) * 100).toFixed(2)}%</div>
                                <Button type='link' onClick={() => {
                                    if (actionKey === index) { setActionKey(-1); return }
                                    else { setActionKey(index) }
                                }}>{actionKey === index ? '收起' : '展开'}</Button>
                                <Tooltip title='删除本行' placement='top'>
                                    <Button onClick={() => handleDelete(index)} type='link'>➖</Button>
                                </Tooltip>
                                {
                                    index === guoyuanbuList.length - 1 && <Tooltip title='添加一行' placement='top'><Button type='link' onClick={handleAdd}>➕</Button></Tooltip>
                                }
                            </li>
                            {(actionKey === index || allAction1) && <div>
                                <ul className='jiesuan-list'>
                                    {ningmengdengjiList.map((item2, index2) => {
                                        //求出占比
                                        const weight = Number((item2.weight * (item.weight / totalWeight)).toFixed(1))
                                        if (!isNaN(weight) && weight > 0) {
                                            return <Tag color='green' key={'jiesuan' + index2} className='jiesuan-item'>
                                                {item2.name} : {weight}kg
                                            </Tag>
                                        }
                                    })}
                                </ul>
                            </div>}
                        </>
                    })}
                </ul>
            </div>
            <div className='section'>
                <div className='section-title'>
                    🍋柠檬等级-总量{totalNingmengWeight}kg
                    <Button onClick={() => checkAllAction(2)}>全部{allAction2 ? '收起' : '展开'}</Button>
                    <Button type='primary' onClick={() => {
                        modal.confirm({
                            title: '重置',
                            content: '重置后所有数据将被清空，是否继续？',
                            onOk() {
                                handleSetNimengdengjiList(initningmengdengji())
                            }
                        })
                    }}>重置</Button>
                </div>
                <ul className='list'>
                    {ningmengdengjiList.map((item, index) => {
                        const zb = ((item.weight / totalNingmengWeight) * 100).toFixed(2)
                        return <> <li key={index} className='item' >
                            <Input value={item.name} className='input' width={100} onChange={(e) => {
                                ningmengdengjiList[index].name = e.target.value
                                handleSetNimengdengjiList([...ningmengdengjiList])
                            }} />:
                            <InputNumber id='ningmeng-num' onKeyDown={(e) => handleNumKeyDown(e, index)} keyboard={false} value={item.weight} onChange={(e) => {
                                ningmengdengjiList[index].weight = e as number
                                handleSetNimengdengjiList([...ningmengdengjiList])
                            }} />kg
                            <div style={{ width: 120 }}>占比：{zb}%</div>
                            <Button type='link' onClick={() => {
                                if (actionKey2 === index) { setActionKey2(-1); return }
                                else { setActionKey2(index) }
                            }}>{actionKey2 === index ? '收起' : '展开'}</Button>
                        </li>
                            {(actionKey2 === index || allAction2) && <div>
                                <ul className='jiesuan-list'>
                                    {guoyuanbuList.map((item2, index2) => {
                                        //求出占比
                                        const weight = Number((item2.weight * (item.weight / totalWeight)).toFixed(1))
                                        if (!isNaN(weight) && weight > 0) {
                                            return <Tag color='green' key={'jiesuan' + index2} className='jiesuan-item'>
                                                {item2.name} : {weight}kg
                                            </Tag>
                                        }
                                    })}
                                </ul>
                            </div>}
                        </>
                    })}
                </ul>
            </div>
        </div>
        <Flex justify='center' align='center' gap={10} style={{ marginTop: 30 }} >
            <h3>
               汇总表格
            </h3>
            <Button icon={<>🪧</>} onClick={selectAllTableCells} type='primary'>复制</Button>
        </Flex>

        <Table size='small' dataSource={tabelData} columns={tableColumns} rowKey={'key'} />
        <div className="footer">
            <Divider style={{ color: 'grey' }}>盈盈算数小屋</Divider>
            <Image style={{ width: 100 }} src="/yy.jpg" alt="" />
        </div>
    </div>
}

export default Index;