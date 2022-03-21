users = [
    ("jobkatest", "skelesftp", "sftp-jobkatest"),
    ("kseuropetest", "skelesftp", "sftp-kseuropetest"),
    ("msazure", "skelesftp", "sftp-testmsazure"),
    ("bedpic", "skelesftp", "sftp-bedpic"),

    ("jobkatest2", "skelesftp", "sftp-jobkatest"),
    ("kseuropetest2", "skelesftp", "sftp-kseuropetest"),
    ("msazure2", "skelesftp", "sftp-testmsazure"),
    ("bedpic2", "skelesftp", "sftp-bedpic"),

    ("jobkatest3", "skelesftp", "sftp-jobkatest"),
    ("kseuropetest3", "skelesftp", "sftp-kseuropetest"),
    ("msazure3", "skelesftp", "sftp-testmsazure"),
    ("bedpic3", "skelesftp", "sftp-bedpic")

    # ("jobkatest4","skelesftp","sftp-jobkatest"),
    # ("kseuropetest4","skelesftp","sftp-kseuropetest"),
    # ("msazure4","skelesftp","sftp-testmsazure"),
    # ("bedpic4","skelesftp","sftp-bedpic")

    # ("jobkatest5","skelesftp","sftp-jobkatest"),
    # ("kseuropetest5","skelesftp","sftp-kseuropetest"),
    # ("msazure5","skelesftp","sftp-testmsazure"),
    # ("bedpic5","skelesftp","sftp-bedpic"),
]


def variables_f():
    result = '"variables": {' + "\n"
    # print(f"LenUsers: {len(users)}\n")
    for i in range(0, len(users)):
        user = users[i]
        result += f'\t\t"sftpUser{i}": "{user[0]}",\n'
        result += f'\t\t"sftpPassword{i}": "{user[1]}",\n'
        result += f'\t\t"existingFileShareName{i}": "{user[2]}",\n'
        result += '\n'

    result += '\t\t"sftpEnvVariable": "[concat('
    for i in range(0, len(users)):
        result += f"variables('sftpUser{i}'), ':', variables('sftpPassword{i}'), ':::upload ', "

    result = result[:-2]
    result += ')]",'
    result += f'''
        "sftpContainerName": "[parameters('sftpContainerName')]",
        "sftpContainerGroupName": "[parameters('sftpContainerGroupName')]",
        "sftpContainerImage": "atmoz/sftp:latest",
        "storageAccountId": "[resourceId(parameters('existingStorageAccountResourceGroupName'), 'Microsoft.Storage/storageAccounts', parameters('existingStorageAccountName'))]"
'''
    result += '\t},\n'
    return result


def resources_volume_mounts_f():
    result = '"volumeMounts": [\n'
    for i in range(0, len(users)):
        result += '\t\t\t\t\t\t\t\t{\n'
        result += '\t\t\t\t\t\t\t\t\t"mountPath": "[concat('+"'/home/'" + \
                                                           ', variables('+f"'sftpUser{i}'" + \
                                                                        '), '+"'/upload'"+')]",\n'
        result += f'\t\t\t\t\t\t\t\t\t"name": "sftpvolume{i}",\n'
        result += '\t\t\t\t\t\t\t\t\t"readOnly": false\n'
        result += '\t\t\t\t\t\t\t\t},\n'

    result = result[:-2]    # Remove last comma
    result += '\n'
    result += '\t\t\t\t\t\t\t]'
    # result += '\n'
    return result


def resources_volumes():
    result = ""
    for i in range(0, len(users)):
        result += '\t\t\t\t\t{\n'
        result += f'\t\t\t\t\t\t"name": "sftpvolume{i}",\n'
        result += '\t\t\t\t\t\t"azureFile": {\n'
        result += \
            f'''                            "readOnly": false,
                            "shareName": "[variables('existingFileShareName{i}')]",
                            "storageAccountName": "[parameters('existingStorageAccountName')]",
                            "storageAccountKey": "[listKeys(variables('storageAccountId'),'2018-02-01').keys[0].value]"
            '''
        result += '\t\t\t}\n'
        result += '\t\t\t\t\t},\n'

    result = result[:-2]
    # result += '\n'

    return result


def resources_volumes_f():
    result = '"volumes": [\n'
    for i in range(0, len(users)):
        result += '\t\t\t\t\t{\n'
        result += f'\t\t\t\t\t\t"name": "sftpvolume{i}",\n'
        result += '\t\t\t\t\t\t"azureFile": {\n'
        result += \
            f'''                            "readOnly": false,
                            "shareName": "[variables('existingFileShareName{i}')]",
                            "storageAccountName": "[parameters('existingStorageAccountName')]",
                            "storageAccountKey": "[listKeys(variables('storageAccountId'),'2018-02-01').keys[0].value]"
            '''
        result += '\t\t\t}\n'
        result += '\t\t\t\t\t},\n'

    result = result[:-2]
    result += '\n'
    result += '\t\t\t\t]'
    # result += '\n'

    return result


# Press the green button in the gutter to run the script.
if __name__ == '__main__':

    whole = f'''{{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {{
        "sftpContainerGroupName": {{
            "type": "string",
            "defaultValue": "jobka-containers-test2",
            "metadata": {{
                "description": "Container group name"
            }}
        }},
        "sftpContainerName": {{
            "type": "string",
            "defaultValue": "jobka-sftp-test2",
            "metadata" : {{
                "description": "Container name in the container group"
            }}
        }},
        "containerGroupDNSLabel": {{
            "type": "string",
            "defaultValue": "jobka-sftp-test2",
            "metadata" : {{
                "description": "DNS label for container group. Generated name would be: uniqueString(resourceGroup().id, deployment().name)"
            }}
        }},
        "existingStorageAccountResourceGroupName": {{
            "type": "string",
            "defaultValue": "JobkaTest",
            "metadata": {{
                "description": "Resource group for existing storage account"
            }}
        }},
        "existingStorageAccountName": {{
            "type": "string",
            "defaultValue": "jobkatest",
            "metadata": {{
                "description": "Name of existing storage account"
            }}
        }},
        "location": {{
            "type": "string",
            "defaultValue": "[resourceGroup().location]",
            "metadata": {{
                "description": "Primary location for resources"
            }}
        }}
    }},
    ''' + variables_f() + f'''  "resources": [
        {{
            "type": "Microsoft.Resources/deployments",
            "name": "pid-18f281fe-d1e1-502c-8b87-d945383dc75b",
            "apiVersion": "2018-05-01",
            "properties": {{
                "mode": "Incremental",
                "template": {{
                    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
                    "contentVersion": "1.0.0.0",
                    "resources": []
                }}
            }}
        }},
        {{
            "type": "Microsoft.ContainerInstance/containerGroups",
            "name": "[variables('sftpContainerGroupName')]",
            "apiVersion": "2018-10-01",
            "location": "[parameters('location')]",
            "properties": {{
                "containers": [
                    {{
                        "name": "[variables('sftpContainerName')]",
                        "properties": {{
                            "image": "[variables('sftpContainerImage')]",
                            "environmentVariables": [
                                {{
                                    "name": "SFTP_USERS",
                                    "secureValue": "[variables('sftpEnvVariable')]"
                                }}
                            ],
                            "resources": {{
                                "requests": {{
                                    "cpu": 1,
                                    "memoryInGB": 0.5
                                }}
                            }},
                            "ports": [
                                {{
                                    "port": 22
                                }}
                            ],
                            ''' + resources_volume_mounts_f() + f'''
                        }}
                    }}
                ],
                "osType": "Linux",
                "ipAddress": {{
                    "type": "Public",
                    "ports": [
                        {{
                            "protocol": "TCP",
                            "port": 22
                        }}
                    ],
                    "dnsNameLabel": "[parameters('containerGroupDNSLabel')]"
                }},
                "restartPolicy": "OnFailure",
                ''' + resources_volumes_f() + f'''
            }}
        }}
    ],
    "outputs": {{
        "containerIPv4Address": {{
            "type": "string",
            "value": "[reference(resourceId('Microsoft.ContainerInstance/containerGroups/', variables('sftpContainerGroupName'))).ipAddress.ip]"
        }},
        "containerDNSLabel": {{
            "type": "string",
            "value": "[concat(parameters('containerGroupDNSLabel'), '.', parameters('location'), '.azurecontainer.io')]"
        }}
    }}
}}'''

    print("-------------------------------------------------------")

    for user in users:
        print("{:<10} {:<45}".format(
            'Host:', 'jobka-sftp-test.westeurope.azurecontainer.io'))
        print("{:<10} {:<45}".format('Port:', '22'))
        print("{:<10} {:<45}".format('Username:', user[0]))
        print("{:<10} {:<45}".format('Password:', user[1]))
        print("{:<10} {:<45}".format('FileShare:', user[2]))
        print("-------------------------------------------------------")

    from datetime import date
    import os
    today = date.today()
    filename = f"{today}_output.json"
    print(os.path.dirname(__file__))
    directory = os.path.dirname(__file__)+"/"
    # os.mkdir(directory)
    filepath = f"{directory}/{filename}"

    f = open(filepath, "w")
    f.write(whole)
    print(f"Template created: {filename}")
    print(f"Path: {filepath}")


# See PyCharm help at https://www.jetbrains.com/help/pycharm/
