checkUserRecords() {
  npx prisma --experimental query "SELECT COUNT(*) as count FROM User;"
  # Kiểm tra mã trạng thái của lệnh prisma query
  if [ $? -eq 0 ]; then
    echo "Truy vấn Prisma thành công."
  else
    echo "Lỗi khi truy vấn Prisma."
    exit 1
  fi
}
startBC() {
    ./network.sh up createChannel -ca -c mychannel -s couchdb 
    ./network.sh deployCC -ccn basic -ccp ./my-chaincode-typescript/ -ccl typescript 
}
stopBC() {
  ./network.sh down
}

startBackend() {
  cd my-server-express/src
    npm start 
   

}

startFrontend() {
  cd my-client/src
  npm run dev
}
command=$1

case $command in
  "startBC")
    echo "Chạy lệnh để chạy dự án"
    startBC
    ;;
  "startBackend")
  echo "Chạy backend server"
  startBackend
    ;;
  "initDB")
  echo "Thêm dữ liệu ban đầu"
  initDB;;
    "startFrontend")
  echo "Chạy frontend server"
    startFrontend
  ;;
    "stopBC")
  echo "Dừng mạng blokchain"
    stopBC
  ;;
  *)
    echo "Lệnh không hợp lệ, hãy thử startBlockchain hoặc startBackend hoặc startFrontend"
    ;;
esac