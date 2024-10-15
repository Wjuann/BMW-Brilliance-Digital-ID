import paramiko

# 测试服务器SSH配置信息
SSH_HOST = '39.106.60.199'
SSH_PORT = 22222
SSH_USERNAME = 'www'
SSH_PASSWORD = 'zatAmqwRf9dYRFN'
SERVICE_NAME = 'nginx' 

# 检查服务状态并尝试启动服务的函数
def manage_service():
    try:
        # 创建SSH对象
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        # 建立SSH连接
        ssh.connect(SSH_HOST, port=SSH_PORT, username=SSH_USERNAME, password=SSH_PASSWORD)
        
        # 检查服务状态
        stdin, stdout, stderr = ssh.exec_command(f'systemctl is-active {SERVICE_NAME}')
        service_status = stdout.read().decode().strip()
        
        # 打印服务状态
        print(f"The service '{SERVICE_NAME}' is {service_status}.")

        # 如果服务未运行，则尝试启动服务
        if service_status != 'active':
            print(f"Attempting to start the service '{SERVICE_NAME}'...")
            stdin, stdout, stderr = ssh.exec_command(f'systemctl start {SERVICE_NAME}')
            print("Command output:", stdout.read().decode())
            if stderr.read():
                print("Error starting service:", stderr.read().decode())

    except paramiko.AuthenticationException:
        print("Authentication failed, please verify your credentials.")
    except paramiko.SSHException as e:
        print(f"SSH connection error: {e}")
    finally:
        # 关闭SSH连接
        ssh.close()

# 主程序入口
if __name__ == '__main__':
    manage_service()
