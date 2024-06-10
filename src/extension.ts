import { exec } from 'child_process'
import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vue-mess-detector" is now active!')

  const outputChannel = vscode.window.createOutputChannel('Vue Mess Detector')

  const disposable = vscode.commands.registerCommand('vue-mess-detector.analyze', async () => {
    const options = [
      { label: 'No additional arguments', description: 'Run npx vue-mess-detector analyze' },
      {
        label: 'laksmi3',
        description: 'Run npx vue-mess-detector analyze laksmi3',
        param: '/home/rrd/public_html/laksmi3/src',
      },
    ]

    const selectedOption = await vscode.window.showQuickPick(options, {
      placeHolder: 'Select an option for the analyze command',
    })

    if (!selectedOption) {
      return // User canceled the selection
    }

    const command = `npx vue-mess-detector analyze ${selectedOption.param}`
    outputChannel.show() // Show the output channel
    outputChannel.appendLine(`Running: ${command}`)

    const panel = vscode.window.createWebviewPanel(
      'vueMessDetectorOutput', // Unique ID for the panel
      'Vue Mess Detector Output', // Panel title
      vscode.ViewColumn.Beside // Optional: Placement relative to editor
    )

    const docStart = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue Mess Detector Output</title>
  </head>
  <body>
  <h1>Vue Mess Detector Output</h1>`

    const docEnd = `</body>
  </html>`

    panel.webview.html = `${docStart} analyzing... ${docEnd}`
    panel.reveal()

    exec(command, (error, stdout, stderr) => {
      if (error) {
        outputChannel.appendLine(`Error: ${error.message}`)
        return
      }
      if (stderr) {
        outputChannel.appendLine(`Error: ${stderr}`)
        return
      }

      let result = stdout.replace(/\x1b\[41m/g, '<span style="background-color: red">')
      result = result.replace(/\x1b\[0m/g, '</span>')
      result = result.replace(/\n/g, '<br>')

      panel.webview.html = `${docStart} ${result} ${docEnd}`
      outputChannel.appendLine(`Analysis complete`)
    })
  })

  context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
