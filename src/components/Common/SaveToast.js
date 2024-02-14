import toastr from "toastr"
import "toastr/build/toastr.min.css"

export const SaveToast = ({ message, type, title }) => {
  toastr.options = {
    positionClass: "toast-top-right",
    timeOut: "5000",
    extendedTimeOut: "1000",
    closeButton: true,
    debug: false,
    progressBar: false,
    preventDuplicates: true,
    newestOnTop: true,
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
    showDuration: "300",
    hideDuration: "1000",
  }

  if (type === "info") toastr.info(message, title)
  else if (type === "warning") toastr.warning(message, title)
  else if (type === "error") toastr.error(message, title)
  else toastr.success(message, title)
}
