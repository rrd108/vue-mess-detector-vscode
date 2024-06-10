import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('vue-mess-detector.analyze', async () => {
    const options = [
      { label: 'No additional arguments', description: 'Run npx vue-mess-detector analyze', param: '' },
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
    const terminal = vscode.window.createTerminal('Vue Mess Detector')
    terminal.sendText(command)
    terminal.show()
  })

  context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
