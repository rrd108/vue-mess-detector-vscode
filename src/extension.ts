import * as vscode from 'vscode'
import * as path from 'path'

interface QuickPickOptionsWithChoices extends vscode.QuickPickOptions {
  choices: vscode.QuickPickItem[]
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('vue-mess-detector.analyze', async () => {
    const options: QuickPickOptionsWithChoices = {
      placeHolder: 'Select an option',
      canPickMany: false,
      choices: [
        { label: 'Analyze current folder', description: 'Analyze the current open folder' },
        { label: 'Select a folder to analyze', description: 'Choose a different folder to analyze' },
      ],
    }

    const choice = await vscode.window.showQuickPick(options.choices, options)

    if (!choice) {
      return
    }

    let folderPath = ''

    if (choice.label === 'Select a folder to analyze') {
      const folderUri = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        openLabel: 'Select a folder to analyze',
      })

      if (!folderUri || folderUri.length === 0) {
        return
      }

      folderPath = folderUri[0].fsPath
    }

    const command = `npx vue-mess-detector analyze ${folderPath}`
    const terminal = vscode.window.createTerminal('Vue Mess Detector')
    terminal.sendText(command)
    terminal.show()
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
