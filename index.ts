import fs from 'fs-extra'
import inquirer from 'inquirer'
import process from 'child_process'
import dayjs from 'dayjs'

const dir = './release'
const json = fs.readdirSync(dir).filter(file => file.endsWith('.json'))

const questions = [
    {
        type: 'list',
        name: 'json',
        message: '请选择一个 JSON 配置文件：',
        choices: json
    }
]
const res = await inquirer.prompt(questions)
const config = JSON.parse(String(fs.readFileSync(dir + '/' + res.json)))

const execPromise = (command: string, cwd: string | URL) => {
    return new Promise<void>((reslove, reject) => {
        process.exec(command, {
            cwd
        }, (error, stdout, stderr) => {
            if (error) {
                console.log('执行命令时遇到错误')
                reject()
            }
            console.log(stdout, stderr)
            reslove()
        })
    })
}

if (config.from) {
    await execPromise(config.build || 'npm run build', config.from)
    console.log('编译完成')
} else {
    throw new Error('编译失败，没有 from 参数。')
}

if (config.to) {
    const files = fs.readdirSync(config.to)
    files.forEach(file => {
        if (file.startsWith('.')) return
        fs.removeSync(config.to + '/' + file)
    })
    console.log('清空目录完成')

    const dirLink = config.dist || 'dist'
    fs.copySync(config.from + '/' + dirLink, config.to)
    console.log('复制文件到 ' + config.to)
} else {
    throw new Error('复制文件失败，没有 to 参数。')
}

if (config.git && config.push) {
    await execPromise('git pull', config.git)
    console.log('代码同步成功')
    
    await execPromise('git add .', config.git)
    console.log('文件添加到 git 暂存区成功')

    const time = dayjs().format('YYYY-MM-DD@HH:mm')
    const res = await inquirer.prompt([{
        type: 'input',
        name: 'commit',
        message: `请输入 commit 内容，默认为 auto_release_${time}：`
    }])
    const commit = res.commit || `auto_release_${time}`

    await execPromise(`git commit -m "[release] ${commit}"`, config.git)
    console.log('添加commit成功')

    await execPromise(config.push, config.git)
    console.log('推送成功')
} else {
    console.log('未推送到 git，如果需要，请在配置中添加 git 目录和 push 命令')
}
